// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form } from "@/components/ui/form";
// import FormInput from "../../../components/common/form-input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { useSearchParams } from "next/navigation";
// import { z } from "zod";
// import Image from "next/image";
// import { committeeAcceptSchema } from "@/lib/schema/comittee-login-schema";
// import { authService } from "@/api/service/auth.service";
// import { toast } from "sonner";

// type CommitteeAcceptSchemaProps = z.infer<typeof committeeAcceptSchema>;

// function CommitteeLoginPage() {
//   const searchParams = useSearchParams();
//   const [rememberMe, setRememberMe] = useState(false);
//   const [validating, setValidating] = useState(false);
//   const [isValidInvite, setIsValidInvite] = useState<boolean | null>(null);

//   const acceptForm = useForm<CommitteeAcceptSchemaProps>({
//     mode: "onSubmit",
//     resolver: zodResolver(committeeAcceptSchema),
//     defaultValues: {
//       email: "testing@gmail.com",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (values: CommitteeAcceptSchemaProps) => {
//     const id = searchParams?.get("id");
//     const token = searchParams?.get("token");

//     if (!id || !token) {
//       toast.error("Missing invite token");
//       return;
//     }

//     const res = await authService.registerWithInvite(
//       id,
//       token,
//       values.email,
//       values.password,
//     );

//     if (!res.success) {
//       toast.error(extractServerMessage(res) ?? "Registration failed");
//       return;
//     }

//     toast.success("Account created! Please login.");
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     const id = searchParams?.get("id");
//     const token = searchParams?.get("token");

//     if (!id || !token) return;

//     setValidating(true);

//     authService
//       .validateInvite(id, token)
//       .then((res) => {
//         if (res.success && res.email) {
//           acceptForm.setValue("email", res.email);
//           setIsValidInvite(true);
//         } else {
//           setIsValidInvite(false);
//           toast.error("Invalid or expired invite link");
//         }
//       })
//       .catch(() => {
//         setIsValidInvite(false);
//         toast.error("Invalid or expired invite link");
//       })
//       .finally(() => setValidating(false));
//   }, [searchParams]);

//   function extractServerMessage(resp: unknown): string | undefined {
//     if (!resp || typeof resp !== "object") return;

//     const obj = resp as Record<string, unknown>;
//     const err = obj.error as Record<string, unknown> | undefined;

//     return (
//       (err?.message as string | undefined) ||
//       (obj.message as string | undefined)
//     );
//   }

//   return (
//     <div className="min-h-screen grid grid-cols-2">
//       {/* Left Image Section */}
//       <div className="col-span-1 items-center justify-center flex">
//         <Image
//           src="/login.png"
//           alt="Login visual"
//           width={466}
//           height={464}
//           className="object-cover w-[466px] h-[464px]"
//         />
//       </div>

//       {/* Right Form Section */}
//       <div className="flex items-center justify-center p-8">
//         <div className="w-[400px]">
//           <p className="text-2xl font-bold mt-4">Welcome To ScholarPro!</p>
//           <p className="text-base font-light mb-10">
//             Set up your password to accept the invitation
//           </p>

//           <Form {...acceptForm}>
//             <form
//               onSubmit={acceptForm.handleSubmit(onSubmit)}
//               className="space-y-4"
//             >
//               <div className="grid w-full items-center gap-4">
//                 <div className="flex flex-col space-y-1.5">
//                   <FormInput<CommitteeAcceptSchemaProps>
//                     control={acceptForm.control}
//                     name="email"
//                     label="Email"
//                     placeholder="email@example.com"
//                     disabled
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-1.5 relative">
//                   <FormInput<CommitteeAcceptSchemaProps>
//                     control={acceptForm.control}
//                     name="password"
//                     label="New Password"
//                     placeholder="Enter your new password"
//                     type="password"
//                   />
//                 </div>
//                 <div className="flex flex-col space-y-1.5 relative">
//                   <FormInput<CommitteeAcceptSchemaProps>
//                     control={acceptForm.control}
//                     name="confirmPassword"
//                     label="Confirm Password"
//                     placeholder="Confirm your new password"
//                     type="password"
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="terms"
//                     checked={rememberMe}
//                     onCheckedChange={(checked) =>
//                       setRememberMe(checked === true)
//                     }
//                   />
//                   <Label htmlFor="terms" className="text-sm">
//                     I agree to the terms and conditions
//                   </Label>
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full mt-2 text-white"
//                   disabled={validating || isValidInvite === false}
//                 >
//                   {validating ? "Validating..." : "Accept Invitation"}
//                 </Button>
//                 {isValidInvite === false && (
//                   <p className="text-sm text-red-500 mt-2">
//                     This invite link is invalid or expired.
//                   </p>
//                 )}
//               </div>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CommitteeLoginPage;

import { Suspense } from "react";
import CommitteeLoginClient from "../committee-login/CommitteeLoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommitteeLoginClient />
    </Suspense>
  );
}
