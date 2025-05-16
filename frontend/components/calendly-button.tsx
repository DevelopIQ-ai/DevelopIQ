import { Button } from './ui/button';
import Link from 'next/link';

export default function CalendlyButton({ size = "large" }) {
  return (
    <Link href="https://zcal.co/i/BT5kddcb" target="_blank" rel="noopener noreferrer">
      <Button 
        className={`bg-[#000000] border-2 border-[#000000] hover:bg-[#E86C24]/90 hover:border-[#E86C24]/90 text-white font-semibold rounded-lg ${
          size === "small" 
            ? "w-[180px] p-4 text-sm" 
            : "w-[248px] px-6 py-6 text-lg"
        }`}
      >
        Book a 15-Minute Call
      </Button>
    </Link>
  )
}