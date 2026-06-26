import InlineLink from "./InlineLink";

export default function Footer() {
    return (
        <footer className="bg-gray-200 p-4 mt-8 flex gap-4">
            <span className="text-gray-600">
                jumpscares
            </span>
            |
            <InlineLink href="/#about">About</InlineLink> |
            <InlineLink href="/#contact">Contact</InlineLink>
        </footer>
    );
}