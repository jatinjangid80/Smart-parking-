import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Trash2, CheckCircle2, AlertCircle, DollarSign, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Notifications() {
  const { user } = useAuth();
  const [showPreferences, setShowPreferences] = useState(false);

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading, refetch: refetchNotifications } = trpc.notifications.list.useQuery(
    { limit: 50 },
    { enabled: !!user }
  );

  // Fetch unread count
  const { data: unreadData } = trpc.notifications.unreadCount.useQuery(undefined, { enabled: !!user });
  const unreadCount = unreadData?.count || 0;

  // Fetch preferences
  const { data: preferences } = trpc.notifications.getPreferences.useQuery(undefined, { enabled: !!user });

  // Mutations
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const deleteNotificationMutation = trpc.notifications.delete.useMutation();
  const updatePreferencesMutation = trpc.notifications.updatePreferences.useMutation();

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync({ notificationId });
      await refetchNotifications();
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotificationMutation.mutateAsync({ notificationId });
      await refetchNotifications();
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handlePreferenceChange = async (key: string, value: string) => {
    try {
      await updatePreferencesMutation.mutateAsync({ [key]: value } as any);
      toast.success("Preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Bell className="w-5 h-5 text-blue-500" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Bell className="w-10 h-10 text-blue-600" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-slate-600 mt-2">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          <Button
            onClick={() => setShowPreferences(!showPreferences)}
            variant="outline"
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Preferences
          </Button>
        </div>

        {/* Preferences Panel */}
        {showPreferences && (
          <Card className="p-6 mb-8 bg-white border-0 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Booking Notifications</p>
                  <p className="text-sm text-slate-600">Get alerts about parking bookings</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences?.bookingNotifications === "true"}
                  onChange={(e) => handlePreferenceChange("bookingNotifications", e.target.checked ? "true" : "false")}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Payment Notifications</p>
                  <p className="text-sm text-slate-600">Get alerts about payments and receipts</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences?.paymentNotifications === "true"}
                  onChange={(e) => handlePreferenceChange("paymentNotifications", e.target.checked ? "true" : "false")}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">System Notifications</p>
                  <p className="text-sm text-slate-600">Get alerts about system updates and maintenance</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences?.systemNotifications === "true"}
                  onChange={(e) => handlePreferenceChange("systemNotifications", e.target.checked ? "true" : "false")}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Message Notifications</p>
                  <p className="text-sm text-slate-600">Get alerts about messages and support responses</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences?.messageNotifications === "true"}
                  onChange={(e) => handlePreferenceChange("messageNotifications", e.target.checked ? "true" : "false")}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences?.emailNotifications === "true"}
                  onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked ? "true" : "false")}
                  className="w-5 h-5"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notificationsLoading ? (
            <Card className="p-8 text-center bg-white border-0 shadow-lg">
              <p className="text-slate-600">Loading notifications...</p>
            </Card>
          ) : notifications.length === 0 ? (
            <Card className="p-8 text-center bg-white border-0 shadow-lg">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No notifications yet</p>
              <p className="text-slate-500 text-sm mt-2">You'll see your notifications here</p>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-6 bg-white border-0 shadow-lg transition-all ${
                  notification.isRead === "false" ? "border-l-4 border-l-blue-600" : ""
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">{notification.title}</h3>
                        <p className="text-slate-600 mt-1">{notification.message}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {notification.isRead === "false" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark as read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action URL */}
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Take Action →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
