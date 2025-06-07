import { Button } from './ui/button';
import Link from 'next/link';

export default function CalendlyButton({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <Link href="https://zcal.co/i/BT5kddcb" target="_blank" rel="noopener noreferrer">
      <Button 
        size={size}
      >
        Book a 15-Minute Call
      </Button>
    </Link>
  )
}