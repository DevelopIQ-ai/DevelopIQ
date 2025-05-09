import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

interface ContactFormParams {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

/**
 * Hook for sending contact form via EmailJS
 * @param serviceID - EmailJS service ID
 * @param templateID - EmailJS template ID
 * @returns Object containing send function, loading and error states
 */
export const useContactForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || null;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_FORM_TEMPLATE_ID || null;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || null;

  // Check localStorage on mount to see if user has already submitted the form
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSubmitted = localStorage.getItem('contactFormSubmitted') === 'true';
      if (hasSubmitted) {
        setIsSubmitted(true);
      }
    }
  }, []);

  // Initialize emailjs on hook mount
  useEffect(() => {
    if (!publicKey) {
      console.error('EmailJS public key is not set');
      return;
    }

    if (!serviceID) {
      console.error('EmailJS service ID is not set');
      return;
    }

    if (!templateID) {
      console.error('EmailJS template ID is not set');
      return;
    }

    emailjs.init({
      publicKey: publicKey,
      // Do not allow headless browsers
      blockHeadless: true,
      limitRate: {
        // Set the limit rate for the application
        id: 'app',
        // Allow 1 request per 10s
        throttle: 10000,
      },
    });
  }, [publicKey, serviceID, templateID]);

  /**
   * Add email to waitlist if not already present
   * @param email - User's email address
   * @returns Promise resolving to boolean indicating if email was added
   
  const addToWaitlist = async (email: string): Promise<boolean> => {
    try {
      // First check if email already exists
      const { data: existingEmails } = await sb
        .from("Waitlist")
        .select("email")
        .eq("email", email);
      
      // If email already exists, just return true without trying to insert again
      if (existingEmails && existingEmails.length > 0) {
        // Update localStorage to indicate they're on the waitlist
        localStorage.setItem("hasJoinedWaitlist", "true");
        
        // Notify all components on this page by dispatching a custom event
        if (typeof document !== 'undefined') {
          document.dispatchEvent(new CustomEvent("localWaitlistUpdate", { 
            detail: { joined: true }
          }));
        }
        
        return true;
      }
      
      // Generate a random numeric ID instead of using UUID
      const numericId = Math.floor(Math.random() * 1000000000); // Random 9-digit number
      
      // Add to Supabase
      const { error: supabaseError } = await sb
        .from("Waitlist")
        .insert([{ id: numericId, email }]);

      if (supabaseError) throw supabaseError;

      // Store joined status in localStorage
      localStorage.setItem("hasJoinedWaitlist", "true");
      
      // Notify all components on this page by dispatching a custom event
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent("localWaitlistUpdate", { 
          detail: { joined: true }
        }));
      }
      
      return true;
    } catch (err) {
      console.error("Error adding to waitlist:", err);
      return false;
    }
  };
  */

  /**
   * Send location request email
   * @param params - Object containing location and email
   * @returns Promise that resolves with the response from emailjs
   */
  const sendContactForm = async ({ firstName, lastName, email, message }: ContactFormParams) => {
    setLoading(true);
    setError(null);

    if (!firstName) {
        setLoading(false);
        setError(new Error('First name is required'));
        return;
    }

    if (!lastName) {
        setLoading(false);
        setError(new Error('Last name is required'));
        return;
    }

    if (!email) {
        setLoading(false);
        setError(new Error('Email is required'));
        return;
    }

    if (!message) {
        setLoading(false);
        setError(new Error('Message is required'));
        return;
    }
    
    try {
      const templateParams = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        message: message,
      };
      
      if (!serviceID || !templateID) {
        throw new Error('EmailJS configuration is missing');
      }

      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams
      );
      
      // Try to add the user to the waitlist - don't block form completion if this fails
    //   await addToWaitlist(email).catch(err => console.error('Waitlist error:', err));
      
      // Store submission status in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('contactFormSubmitted', 'true');
      }
      
      setLoading(false);
      setIsSubmitted(true);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    }
  };

  return {
    sendContactForm,
    loading,
    error,
    isSubmitted
  };
};
