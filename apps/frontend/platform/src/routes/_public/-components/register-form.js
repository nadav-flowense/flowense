import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import * as v from 'valibot';
import { authClient } from '@/clients/authClient';
import FormFieldInfo from '@/routes/-components/common/form-field-info';
import Spinner from '@/routes/-components/common/spinner';
const FormSchema = v.pipe(v.object({
    name: v.pipe(v.string(), v.minLength(2, 'Name must be at least 2 characters')),
    email: v.pipe(v.string(), v.email('Please enter a valid email address')),
    password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
    confirmPassword: v.string(),
}), v.forward(v.partialCheck([['password'], ['confirmPassword']], (input) => input.password === input.confirmPassword, 'The two passwords do not match.'), ['confirmPassword']));
export default function RegisterCredentialsForm() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validators: {
            onChange: FormSchema,
        },
        onSubmit: async ({ value }) => {
            const { error } = await authClient.signUp.email({
                name: value.name,
                email: value.email,
                password: value.password,
            }, {
                onSuccess: () => {
                    navigate({ to: '/' });
                },
            });
            if (error) {
                toast.error(error.message ?? JSON.stringify(error));
            }
        },
    });
    return (_jsxs("form", { className: "flex flex-col gap-y-3", onSubmit: (e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        }, children: [_jsx("div", { children: _jsx(form.Field, { name: "name", children: (field) => (_jsxs(_Fragment, { children: [_jsx(Label, { htmlFor: field.name, children: "Full Name" }), _jsx(Input, { className: "mt-1", id: field.name, type: "text", name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value) }), _jsx(FormFieldInfo, { field: field })] })) }) }), _jsx("div", { children: _jsx(form.Field, { name: "email", children: (field) => (_jsxs(_Fragment, { children: [_jsx(Label, { htmlFor: field.name, children: "Email" }), _jsx(Input, { className: "mt-1", id: field.name, type: "email", name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value) }), _jsx(FormFieldInfo, { field: field })] })) }) }), _jsx("div", { children: _jsx(form.Field, { name: "password", children: (field) => (_jsxs(_Fragment, { children: [_jsx(Label, { htmlFor: field.name, children: "Password" }), _jsxs("div", { className: "flex justify-end items-center relative w-full", children: [_jsx(Input, { className: "mt-1", id: field.name, type: isPasswordVisible ? 'text' : 'password', name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value) }), _jsx(Button, { className: "absolute mr-2 w-7 h-7 rounded-full", type: "button", tabIndex: -1, variant: "ghost", size: "icon", onClick: (e) => {
                                            e.preventDefault();
                                            setIsPasswordVisible(!isPasswordVisible);
                                        }, children: isPasswordVisible ? _jsx(EyeOpenIcon, {}) : _jsx(EyeNoneIcon, {}) })] }), _jsx(FormFieldInfo, { field: field })] })) }) }), _jsx("div", { children: _jsx(form.Field, { name: "confirmPassword", children: (field) => (_jsxs(_Fragment, { children: [_jsx(Label, { htmlFor: field.name, children: "Confirm Password" }), _jsxs("div", { className: "flex justify-end items-center relative w-full", children: [_jsx(Input, { className: "mt-1", id: field.name, type: isConfirmPasswordVisible ? 'text' : 'password', name: field.name, value: field.state.value, onBlur: field.handleBlur, onChange: (e) => field.handleChange(e.target.value) }), _jsx(Button, { className: "absolute mr-2 w-7 h-7 rounded-full", type: "button", tabIndex: -1, variant: "ghost", size: "icon", onClick: (e) => {
                                            e.preventDefault();
                                            setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
                                        }, children: isConfirmPasswordVisible ? _jsx(EyeOpenIcon, {}) : _jsx(EyeNoneIcon, {}) })] }), _jsx(FormFieldInfo, { field: field })] })) }) }), _jsx(form.Subscribe, { selector: (state) => [state.canSubmit, state.isSubmitting], children: ([canSubmit, isSubmitting]) => (_jsx(Button, { type: "submit", disabled: !canSubmit, className: "h-12 mt-3", children: isSubmitting ? _jsx(Spinner, {}) : 'Register' })) })] }));
}
