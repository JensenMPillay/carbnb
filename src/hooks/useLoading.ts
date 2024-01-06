import { useEffect, useState } from "react";

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
