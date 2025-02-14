import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Upload, Globe2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileFormProps {
  initialData?: {
    photoUrl?: string;
    about?: string;
    languages?: string[];
    verifications?: {
      email: boolean;
      phone: boolean;
      identity: boolean;
    };
  };
}

const defaultData = {
  photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  about: "Hello! I love traveling and meeting new people.",
  languages: ["English"],
  verifications: {
    email: true,
    phone: false,
    identity: false,
  },
};

const ProfileForm = ({ initialData = defaultData }: ProfileFormProps) => {
  const [photoUrl, setPhotoUrl] = useState(initialData.photoUrl);
  const [about, setAbout] = useState(initialData.about);
  const [languages, setLanguages] = useState(initialData.languages);

  return (
    <Card className="p-6 space-y-8 bg-white">
      {/* Profile Photo Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Profile Photo</h3>
        <div className="flex items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={photoUrl} alt="Profile photo" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Photo
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">About</h3>
        <div className="space-y-2">
          <Label htmlFor="about">Tell us about yourself</Label>
          <Textarea
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Share a bit about yourself..."
            className="min-h-[120px]"
          />
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Languages I Speak</h3>
        <div className="space-y-2">
          <Select defaultValue={languages?.[0]}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 flex-wrap">
            {languages?.map((lang) => (
              <Badge
                key={lang}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Globe2 className="w-3 h-3" />
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Verifications Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Verifications</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {initialData.verifications?.email && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            <span>Email verified</span>
          </div>
          <div className="flex items-center gap-2">
            {initialData.verifications?.phone && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            <span>Phone number verified</span>
          </div>
          <div className="flex items-center gap-2">
            {initialData.verifications?.identity && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            <span>Identity verified</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button className="w-full sm:w-auto">Save Changes</Button>
      </div>
    </Card>
  );
};

export default ProfileForm;
