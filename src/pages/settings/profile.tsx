import { lazy, Suspense } from "react";
import ProfileFormSkeleton from "@/components/settings/ProfileFormSkeleton";

const ProfileForm = lazy(() => import("@/components/settings/ProfileForm"));

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFormSkeleton />}>
      <ProfileForm />
    </Suspense>
  );
}
