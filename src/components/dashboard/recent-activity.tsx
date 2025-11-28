"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mockRecentActivity } from "@/lib/placeholder-data"
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from "react";

export function RecentActivity() {
  // useEffect to handle hydration mismatch with formatDistanceToNow
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Attendance</CardTitle>
        <CardDescription>
          Latest check-ins from members.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecentActivity.map((activity) => (
          <div className="flex items-center" key={activity.id}>
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={activity.user.avatarUrl} alt="Avatar" />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Attended "{activity.session.title}"
              </p>
            </div>
            <div className="ml-auto font-medium text-sm text-muted-foreground">
              {isClient ? formatDistanceToNow(new Date(activity.attendedAt), { addSuffix: true }) : ''}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
