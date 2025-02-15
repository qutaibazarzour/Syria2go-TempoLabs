import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Globe2, Star, Home, Upload } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/auth";
import { UserProfile } from "@/lib/types";
import { fetchUserProfile } from "@/services/profile";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import PropertyCard from "@/components/PropertyCard";
import ProfileForm from "@/components/settings/ProfileForm";

import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      setLoading(true);
      const data = await fetchUserProfile(id);
      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="animate-pulse p-8">Loading...</div>
        <MobileNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="p-8">Profile not found</div>
        <MobileNav />
      </div>
    );
  }

  const joinedDate = new Date(profile.created_at);
  const timeOnPlatform = formatDistanceToNow(joinedDate, { addSuffix: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Sticky */}
          <div className="md:w-1/3">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 bg-white">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage
                      src={profile.photo_url}
                      alt={profile.username}
                    />
                    <AvatarFallback>{profile.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-semibold mb-2">
                    {profile.username}
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    On SyriaGo for {timeOnPlatform}
                  </p>
                  {user?.id === profile.id && !isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">Verifications</h3>
                  <div className="space-y-3">
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
                      <span>Phone verified</span>
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
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="md:w-2/3">
            {isEditing ? (
              <ProfileForm
                profile={profile}
                onSaved={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                {/* About Section */}
                <Card className="p-6 bg-white">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground">{profile.about_intro}</p>
                </Card>

                {/* Languages Section */}
                <Card className="p-6 bg-white">
                  <h2 className="text-xl font-semibold mb-4">Languages</h2>
                  <div className="flex gap-2 flex-wrap">
                    {profile.languages?.map((lang) => (
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
                </Card>

                {/* Reviews Section */}
                {profile.reviews && profile.reviews.length > 0 && (
                  <Card className="p-6 bg-white">
                    <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                    <div className="space-y-4">
                      {profile.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {Array.from({ length: review.rating || 0 }).map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ),
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(review.created_at), "MMMM yyyy")}
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Listings Section */}
                {profile.properties && profile.properties.length > 0 && (
                  <Card className="p-6 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Home className="w-5 h-5" />
                      <h2 className="text-xl font-semibold">Properties</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {profile.properties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          images={
                            property.property_images?.map((img) => img.url) ||
                            []
                          }
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
            )}
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
