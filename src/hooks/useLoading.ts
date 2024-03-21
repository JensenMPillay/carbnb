import { useEffect, useState } from "react";

/**
 * Custom hook to manage loading state.
 * @returns {object} - Object containing the isLoading boolean state.
 * @example
 * const { isLoading } = useLoading();
 * if (isLoading) console.log(isLoading)...
 */
const useLoading = () => {
  // Loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);

    return () => {
      setIsLoading(true);
    };
  }, []);
  return { isLoading };
};

export default useLoading;
