import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Upload, Globe2, Star, Home } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { UserProfile } from "@/lib/types";
import { updateUserProfile, uploadProfilePhoto } from "@/services/profile";
import PropertyCard from "@/components/PropertyCard";

interface ProfileFormProps {
  profile?: UserProfile;
  isPublicView?: boolean;
}

const defaultProfile: UserProfile = {
  id: "",
  email: "",
  username: "New User",
  photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  about_intro: "Hello! I love traveling and meeting new people.",
  languages: ["English"],
  created_at: new Date().toISOString(),
  verifications: {
    id: "",
    user_id: "",
    email_verified: false,
    phone_verified: false,
    identity_verified: false,
    created_at: new Date().toISOString(),
  },
  reviews: [],
  properties: [],
};

const ProfileForm = ({
  profile = defaultProfile,
  isPublicView = false,
}: ProfileFormProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile.username || "",
    photo_url: profile.photo_url || "",
    about_intro: profile.about_intro || "",
    languages: profile.languages || [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const photoUrl = await uploadProfilePhoto(user.id, file);
      if (photoUrl) {
        setFormData((prev) => ({ ...prev, photo_url: photoUrl }));
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updated = await updateUserProfile(user.id, {
        username: formData.username,
        photo_url: formData.photo_url,
        about_intro: formData.about_intro,
        languages: formData.languages,
      });
      if (updated) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const canEdit = !isPublicView && user?.id === profile.id;

  return (
    <div className="space-y-8">
      <Card className="p-6 space-y-8 bg-white">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData.photo_url} alt={formData.username} />
              <AvatarFallback>{formData.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{formData.username}</h2>
              <p className="text-muted-foreground">
                Joined {format(new Date(profile.created_at), "MMMM yyyy")}
              </p>
            </div>
          </div>
          {canEdit && (
            <div className="space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          )}
        </div>

        {/* Profile Photo Upload */}
        {isEditing && (
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Change Photo
            </Button>
          </div>
        )}

        {/* About Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About</h3>
          {isEditing ? (
            <Textarea
              value={formData.about_intro}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  about_intro: e.target.value,
                }))
              }
              placeholder="Share a bit about yourself..."
              className="min-h-[120px]"
            />
          ) : (
            <p className="text-muted-foreground">{formData.about_intro}</p>
          )}
        </div>

        {/* Languages Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Languages</h3>
          {isEditing ? (
            <div className="space-y-2">
              <Select
                value={formData.languages[0]}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    languages: [...new Set([value, ...prev.languages])],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Add a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Arabic">Arabic</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="flex gap-2 flex-wrap">
            {formData.languages.map((lang) => (
              <Badge
                key={lang}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Globe2 className="w-3 h-3" />
                {lang}
                {isEditing && (
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        languages: prev.languages.filter((l) => l !== lang),
                      }))
                    }
                  >
                    ×
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* Verifications Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Verifications</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {profile.verifications?.email_verified ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span>Email verified</span>
            </div>
            <div className="flex items-center gap-2">
              {profile.verifications?.phone_verified ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span>Phone number verified</span>
            </div>
            <div className="flex items-center gap-2">
              {profile.verifications?.identity_verified ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4" />
              )}
              <span>Identity verified</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Reviews Section */}
      {profile.reviews && profile.reviews.length > 0 && (
        <Card className="p-6 space-y-6 bg-white">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <div
                key={review.id}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: review.rating || 0 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), "MMMM yyyy")}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Listings Section */}
      {profile.properties && profile.properties.length > 0 && (
        <Card className="p-6 space-y-6 bg-white">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Properties</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.properties.map((property) => (
              <PropertyCard
                key={property.id}
                images={property.property_images?.map((img) => img.url) || []}
                title={property.title}
                location={property.location}
                price={property.price}
                rating={property.rating}
                reviews={property.reviews}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProfileForm;
