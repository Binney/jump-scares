import Header from "@/components/Header";

export default function NonHomepageLayout({ children }: {
    children: React.ReactNode;
}) {
    return <>
        <Header />
        {children}
    </>;
}
