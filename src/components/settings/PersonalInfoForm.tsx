import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

interface PersonalInfoFormData {
  legalName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

interface PersonalInfoFormProps {
  initialData?: PersonalInfoFormData;
  onSubmit?: (data: PersonalInfoFormData) => void;
}

const defaultFormData: PersonalInfoFormData = {
  legalName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA 12345",
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "+1 (555) 987-6543",
  emergencyContactRelation: "Spouse",
};

export default function PersonalInfoForm({
  initialData = defaultFormData,
  onSubmit,
}: PersonalInfoFormProps) {
  const { register, handleSubmit } = useForm<PersonalInfoFormData>({
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: PersonalInfoFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card className="w-full max-w-2xl p-6 bg-white">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Personal Information</h2>

          <div className="space-y-2">
            <Label htmlFor="legalName">Legal Name</Label>
            <Input
              id="legalName"
              {...register("legalName")}
              placeholder="Enter your legal name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter your full address"
              className="min-h-[100px]"
            />
          </div>

          <div className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Emergency Contact</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  {...register("emergencyContactName")}
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  {...register("emergencyContactPhone")}
                  placeholder="Enter emergency contact phone"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relationship</Label>
                <Input
                  id="emergencyContactRelation"
                  {...register("emergencyContactRelation")}
                  placeholder="Enter relationship to emergency contact"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
