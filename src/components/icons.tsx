import Image from "next/image";

interface IconProps extends React.ComponentProps<typeof Image> {
	className?: string;
}

const GoogleIcon = ({ className, ...props }: IconProps) => (
	<Image
		src="/icons/google.svg"
		alt="Google"
		width={16}
		height={16}
		className={className}
		{...props}
	/>
);

export const Icons = {
	google: GoogleIcon,
};
