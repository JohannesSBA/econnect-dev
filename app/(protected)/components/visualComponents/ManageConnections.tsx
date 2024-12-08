import { cn } from "@/app/lib/utils";
import { ArrowRight, Users, UserPlus, Clock } from "lucide-react";

interface ManageProps {
    connectionsLength: number;
    pendingFriendRequests: number;
}

const ManageConnections = ({
    connectionsLength,
    pendingFriendRequests,
}: ManageProps) => {
    const connectionItems = [
        {
            title: "Connections",
            count: connectionsLength,
            icon: Users,
            href: "/dashboard/connections",
        },
        {
            title: "Grow Network",
            count: null,
            icon: UserPlus,
            href: "/dashboard/connections#grow",
        },
        {
            title: "Pending Requests",
            count: pendingFriendRequests,
            icon: Clock,
            href: "/chat/friend-requests",
        },
    ];

    return (
        <div className="md:min-h-screen  p-6">
            <div className=" mx-auto">
                <div className=" rounded-xl overflow-hidden">
                    <div className="p-5 ">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Manage Connections
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {connectionItems.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <item.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {item.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {item.count !== null && (
                                        <span
                                            className={cn(
                                                "text-sm font-medium",
                                                item.count > 0
                                                    ? "text-blue-600"
                                                    : "text-gray-500"
                                            )}
                                        >
                                            {item.count}
                                        </span>
                                    )}
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageConnections;
