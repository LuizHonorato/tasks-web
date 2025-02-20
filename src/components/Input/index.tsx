import { InputHTMLAttributes } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export default function Input({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  ...rest
}: InputProps) {
  return (
    <>
      <input
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
        {...rest}
      />
      {error && <span className="text-sm text-red-500 my-1">{error}</span>}
    </>
  );
}
