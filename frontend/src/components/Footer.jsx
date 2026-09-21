export default function Footer() {
  return (
    <footer className="border-t bg-background py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        © {new Date().getFullYear()} EventHub. All rights reserved.
      </div>
    </footer>
  );
}