"use client";
import { CarQuery } from "@/src/@types/queries.types";
import { Skeleton } from "@/src/components/ui/skeleton";
import { GET_USER_QUERY } from "@/src/lib/graphql/user";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import useSessionStore from "@/src/store/useSessionStore";
import useStore from "@/src/store/useStore";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import UserCarCard from "./UserCarCard";

type Props = {};

const UserCars = (props: Props) => {
  // Access to Store Data after Rendering (SSR Behavior)
  const session = useStore(useSessionStore, (state) => state.session);

  // User
  const user = session?.user;

  // Get Query
  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { id: session?.user?.id },
    // notifyOnNetworkStatusChange: true,
    // onCompleted: async (data) => {},
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
  });

  if (loading)
    return (
      <div className="grid grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
        <Skeleton className="h-[50dvh] w-full" />
        <Skeleton className="h-[50dvh] w-full" />
        <Skeleton className="h-[50dvh] w-full" />
      </div>
    );
  return (
    <div className="grid grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
      {data &&
        data.getUser.cars.map((car: CarQuery) => (
          <UserCarCard key={car.id} car={car} />
        ))}
    </div>
  );
};

export default UserCars;
