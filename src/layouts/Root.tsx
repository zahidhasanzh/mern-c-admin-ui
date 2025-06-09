import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthStore } from "../store";
import { useEffect } from "react";


const Root = () => {
  const {setUser} = useAuthStore()
  const getSalf = async () => {
    const { data } = await self();
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSalf,
  });

  useEffect(() => {
      if(data){
        setUser(data)
      }
  }, [data, setUser])




  if(isLoading){
     return <div>Loading...</div>
  }



  return <Outlet />;
};

export default Root;
