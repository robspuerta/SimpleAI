import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function EventLogger() {
  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading events...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Event Logs
          <Badge variant="secondary">{Array.isArray(events) ? events.length : 0} events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {Array.isArray(events) && events.map((event: any) => (
              <div
                key={event.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm">{event.event}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  Element: {event.element}
                </div>
                {event.data && (
                  <pre className="text-xs text-gray-500 bg-white p-2 rounded border overflow-x-auto">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                )}
              </div>
            ))}
            {!Array.isArray(events) || events.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No events logged yet
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
