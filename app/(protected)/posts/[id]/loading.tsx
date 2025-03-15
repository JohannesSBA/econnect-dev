import { Card, Skeleton, Divider } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 h-10 w-20">
        <Skeleton className="rounded-lg h-full w-full" />
      </div>
      
      <Card className="p-6 mb-8">
        <div className="flex items-center mb-4">
          <Skeleton className="rounded-full h-14 w-14 mr-4" />
          <div className="space-y-2">
            <Skeleton className="rounded-lg h-4 w-40" />
            <Skeleton className="rounded-lg h-3 w-32" />
            <Skeleton className="rounded-lg h-3 w-24" />
          </div>
        </div>
        
        <Skeleton className="rounded-lg h-8 w-3/4 mb-2" />
        <div className="space-y-2 mb-6">
          <Skeleton className="rounded-lg h-4 w-full" />
          <Skeleton className="rounded-lg h-4 w-full" />
          <Skeleton className="rounded-lg h-4 w-5/6" />
          <Skeleton className="rounded-lg h-4 w-4/6" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          <Skeleton className="rounded-lg h-64 col-span-1" />
          <div className="flex flex-col gap-2">
            <Skeleton className="rounded-lg h-[7.75rem]" />
            <Skeleton className="rounded-lg h-[7.75rem]" />
          </div>
        </div>
        
        <Divider className="my-4" />
        
        <div className="flex gap-4 my-2">
          <Skeleton className="rounded-lg h-8 w-24" />
          <Skeleton className="rounded-lg h-8 w-24" />
          <Skeleton className="rounded-lg h-8 w-24" />
        </div>
        
        <Divider className="my-4" />
        
        <div className="mt-6">
          <Skeleton className="rounded-lg h-6 w-40 mb-4" />
          
          <div className="flex gap-2 mb-6">
            <Skeleton className="rounded-lg h-10 flex-1" />
            <Skeleton className="rounded-lg h-10 w-16" />
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center mb-2">
                  <Skeleton className="rounded-full h-8 w-8 mr-2" />
                  <div className="space-y-1">
                    <Skeleton className="rounded-lg h-3 w-32" />
                    <Skeleton className="rounded-lg h-2 w-24" />
                  </div>
                </div>
                <div className="pl-10 space-y-1">
                  <Skeleton className="rounded-lg h-3 w-5/6" />
                  <Skeleton className="rounded-lg h-3 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Loading; 