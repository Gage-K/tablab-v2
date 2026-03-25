import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useTypedAuth from "../hooks/useTypedAuth";
import { AxiosError } from "axios";
import { redirect } from "react-router";
import { SkeletonText } from "../components/Skeleton";
import {
  useUserProfile,
  useUpdateEmail,
  useUpdateUsername,
  useUpdatePassword,
} from "../hooks/useUserProfile";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import {
  Check,
  X,
  SignOut,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";

export default function Profile() {
  const { setAuth } = useTypedAuth();
  const axiosPrivate = useAxiosPrivate();
  const { data: user, isLoading } = useUserProfile();

  // Username editing
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const updateUsernameMutation = useUpdateUsername();

  // Email editing
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const updateEmailMutation = useUpdateEmail();

  // Password editing
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const updatePasswordMutation = useUpdatePassword();

  // Logout dialog
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email || "");
    }
  }, [user]);

  const usernameChanged = username !== (user?.username ?? "");
  const emailChanged = email !== (user?.email ?? "");

  function handleMutationError(
    err: unknown,
    setErrFn: (msg: string) => void
  ) {
    if (err instanceof AxiosError) {
      if (!err.response) {
        setErrFn("No server response");
      } else if (err.response.status === 409) {
        setErrFn(err.response.data?.message || "Already taken");
      } else if (err.response.status === 401) {
        setErrFn(err.response.data?.message || "Unauthorized");
      } else {
        setErrFn("Update failed. Please try again.");
      }
    } else {
      setErrFn("Update failed. Please try again.");
    }
  }

  function handleUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUsernameErr("");
    updateUsernameMutation.mutate(username, {
      onError: (err) => handleMutationError(err, setUsernameErr),
    });
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailErr("");
    updateEmailMutation.mutate(email, {
      onError: (err) => handleMutationError(err, setEmailErr),
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordErr("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordErr("Passwords do not match");
      return;
    }

    updatePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setPasswordSuccess("Password updated successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err) => handleMutationError(err, setPasswordErr),
      }
    );
  }

  async function handleLogout() {
    try {
      await axiosPrivate.post("/api/auth/logout", {});
    } finally {
      setAuth({});
      redirect("/");
    }
  }

  function getInitials(name: string) {
    return name
      .split(/[\s-_]+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 px-4">
        <SkeletonText />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-16" size="lg">
              <AvatarFallback className="text-lg">
                {user?.username ? getInitials(user.username) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user?.username}</CardTitle>
              <CardDescription>
                {user?.email || "No email set"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Member since</span>
              <p>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "Unknown"}
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Last login</span>
              <p>
                {user?.last_login
                  ? new Date(user.last_login).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Username */}
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>
            Your unique username used to identify your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUsernameSubmit}>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameErr("");
                }}
                placeholder="Your username"
                maxLength={24}
              />
              {usernameErr && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="size-3.5" weight="bold" />
                  {usernameErr}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                4-24 characters. Letters, numbers, hyphens, and underscores
                only.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              size="sm"
              disabled={!usernameChanged || updateUsernameMutation.isPending}
            >
              {updateUsernameMutation.isPending ? "Saving..." : "Save username"}
            </Button>
            {updateUsernameMutation.isSuccess && !usernameChanged && (
              <span className="text-sm text-muted-foreground flex items-center gap-1 ml-3">
                <Check className="size-3.5" weight="bold" />
                Saved
              </span>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Your email address for account notifications.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailSubmit}>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailErr("");
                }}
                placeholder="you@example.com"
              />
              {emailErr && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="size-3.5" weight="bold" />
                  {emailErr}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              size="sm"
              disabled={!emailChanged || updateEmailMutation.isPending}
            >
              {updateEmailMutation.isPending ? "Saving..." : "Save email"}
            </Button>
            {updateEmailMutation.isSuccess && !emailChanged && (
              <span className="text-sm text-muted-foreground flex items-center gap-1 ml-3">
                <Check className="size-3.5" weight="bold" />
                Saved
              </span>
            )}
          </CardFooter>
        </form>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setPasswordErr("");
                      setPasswordSuccess("");
                    }}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-2">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordErr("");
                      setPasswordSuccess("");
                    }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  8-24 characters with uppercase, lowercase, number, and special
                  character (!@#$%).
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordErr("");
                    setPasswordSuccess("");
                  }}
                  placeholder="Confirm new password"
                />
              </div>

              {passwordErr && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <X className="size-3.5" weight="bold" />
                  {passwordErr}
                </p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Check className="size-3.5" weight="bold" />
                  {passwordSuccess}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button
              type="submit"
              size="sm"
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                updatePasswordMutation.isPending
              }
            >
              {updatePasswordMutation.isPending
                ? "Updating..."
                : "Update password"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Log out</p>
          <p className="text-sm text-muted-foreground">
            End your current session on this device.
          </p>
        </div>
        <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <SignOut className="size-4 mr-1.5" />
              Log out
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log out</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out? You will need to sign in
                again to access your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleLogout}>
                Log out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
