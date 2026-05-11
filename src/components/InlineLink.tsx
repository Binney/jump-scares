import Link from "next/link";

export default function InlineLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const isExternal = href.startsWith("http");
    return (
        <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-blue-800 underline hover:text-blue-600"
        >
            {children}
        </Link>
    );
}
