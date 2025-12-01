import type { ComponentProps, FormEvent, ReactElement } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../../atoms/Button";
import { Heading } from "../../atoms/Heading";
import { GoogleIcon } from "../../atoms/Icon/GoogleIcon";
import { Input, PasswordInput } from "../../atoms/Input";
import { Link } from "../../atoms/Link";
import { Text } from "../../atoms/Text";

export interface SignUpFormProps
	extends Omit<ComponentProps<"form">, "onSubmit"> {
	onSubmit?: (data: SignUpFormData) => void;
	onGoogleSignUp?: () => void;
	onLoginClick?: () => void;
	isLoading?: boolean;
}

export interface SignUpFormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export function SignUpForm({
	className,
	onSubmit,
	onGoogleSignUp,
	onLoginClick,
	isLoading = false,
	...props
}: SignUpFormProps): ReactElement {
	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const firstName = formData.get("firstName");
		const lastName = formData.get("lastName");
		const email = formData.get("email");
		const password = formData.get("password");
		const data: SignUpFormData = {
			firstName: typeof firstName === "string" ? firstName : "",
			lastName: typeof lastName === "string" ? lastName : "",
			email: typeof email === "string" ? email : "",
			password: typeof password === "string" ? password : "",
		};
		onSubmit?.(data);
	};

	return (
		<form
			className={cn(
				"flex flex-col items-center w-full max-w-[400px] mx-auto",
				className,
			)}
			onSubmit={handleSubmit}
			{...props}
		>
			{/* Title */}
			<Heading>Sign up to Flowense</Heading>

			{/* Google Sign Up Button */}
			<Button
				type="button"
				variant="social"
				size="social"
				icon={<GoogleIcon />}
				onClick={onGoogleSignUp}
				disabled={isLoading}
				className="w-full h-16 mb-6"
			>
				Sign up with Google
			</Button>

			{/* Divider */}
			<div className="flex items-center gap-6 w-full mb-4">
				<div className="flex-1 h-0.5 bg-gray-300/25" />
				<Text className="font-avenir text-lg text-gray-600 inline">OR</Text>
				<div className="flex-1 h-0.5 bg-gray-300/25" />
			</div>

			{/* Subtitle */}
			<Text className="font-medium text-base text-gray-500 mb-6 tracking-[0.08px]">
				Create an account with password
			</Text>

			{/* First Name and Last Name - Side by Side */}
			<div className="flex gap-5 w-full mb-5">
				<Input
					name="firstName"
					placeholder="First Name"
					required
					disabled={isLoading}
					containerClassName="flex-1"
					className="h-[62px] px-5 py-[22px] text-[15px] font-medium"
				/>
				<Input
					name="lastName"
					placeholder="Last Name"
					required
					disabled={isLoading}
					containerClassName="flex-1"
					className="h-[62px] px-5 py-[22px] text-[15px] font-medium"
				/>
			</div>

			{/* Email */}
			<Input
				name="email"
				type="email"
				placeholder="Email Address"
				required
				disabled={isLoading}
				containerClassName="w-full mb-5"
				className="h-[62px] px-5 py-[22px] text-[15px] font-medium"
			/>

			{/* Password */}
			<PasswordInput
				name="password"
				placeholder="Password"
				required
				disabled={isLoading}
				containerClassName="w-full mb-5"
				className="h-[62px] px-5 py-[22px] text-[15px] font-medium"
			/>

			{/* Sign Up Button */}
			<Button
				type="submit"
				variant="dark"
				className="w-full h-[61px] text-[15px] font-semibold mb-6"
				loading={isLoading}
			>
				Sign Up
			</Button>

			{/* Terms Text */}
			<Text className="font-poppins text-base text-gray-600 text-center mb-6 px-2">
				By creating an account, you agree to our{" "}
				<Link
					to="/terms"
					className="text-gray-900 underline decoration-solid underline-offset-2"
				>
					Terms of use
				</Link>{" "}
				and{" "}
				<Link
					to="/privacy"
					className="text-gray-900 underline decoration-solid underline-offset-2"
				>
					Privacy Policy
				</Link>
			</Text>

			{/* Login Link */}
			<Text className="font-medium text-base text-gray-500 tracking-[0.08px]">
				Already have an account?{" "}
				<Text
					className="inline font-bold text-blue-600 underline decoration-solid underline-offset-2 cursor-pointer"
					onClick={onLoginClick}
				>
					Login
				</Text>
			</Text>
		</form>
	);
}

SignUpForm.displayName = "SignUpForm";
