import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

interface RequestForLocationParams {
  location: string;
  email: string;
}

/**
 * Hook for sending location requests via EmailJS
 * @param serviceID - EmailJS service ID
 * @param templateID - EmailJS template ID
 * @returns Object containing send function, loading and error states
 */
export const useRequestForLocation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || null;
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_REQUEST_FOR_LOCATION_TEMPLATE_ID || null;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || null;

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
   * Send location request email
   * @param params - Object containing location and email
   * @returns Promise that resolves with the response from emailjs
   */
  const sendLocationRequest = async ({ location, email }: RequestForLocationParams) => {
    setLoading(true);
    setError(null);

    if (!location) {
        setLoading(false);
        setError(new Error('Location is required'));
        return;
    }

    if (!email) {
        setLoading(false);
        setError(new Error('Email is required'));
        return;
    }
    
    try {
      const templateParams = {
        address: location,
        requester: email,
      };
      
      if (!serviceID || !templateID) {
        throw new Error('EmailJS configuration is missing');
      }

      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams
      );
      
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
    sendLocationRequest,
    loading,
    error,
    isSubmitted
  };
};
