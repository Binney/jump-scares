import InlineLink from "./InlineLink";

export default function Footer() {
    return (
        <footer className="bg-gray-200 p-4 mt-8">
            <p className="text-gray-600">
                jumpscares
            </p>
            <InlineLink href="/#about">About</InlineLink>
            <InlineLink href="/#contact">Contact</InlineLink>
        </footer>
    );
}