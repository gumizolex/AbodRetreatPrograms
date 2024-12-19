import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Activity } from "lucide-react";
import { ProgramManagement } from "./admin/ProgramManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { exchangeRates } from "@/utils/currency";

export function AdminDashboard() {
  const { data: bookings, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      console.log('Fetching bookings...');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }
      
      console.log('Fetched bookings:', data);
      return data || [];
    },
  });

  if (isError) {
    console.error('Error in bookings query');
  }

  const totalBookings = bookings?.length || 0;
  const activeGuests = bookings?.filter(b => b.status === 'confirmed')?.length || 0;
  const utilizationRate = totalBookings > 0 ? Math.round((activeGuests / totalBookings) * 100) : 0;
  
  const baseRevenueHUF = bookings
    ?.filter(b => {
      const bookingDate = new Date(b.created_at);
      const currentDate = new Date();
      return bookingDate.getMonth() === currentDate.getMonth() &&
             bookingDate.getFullYear() === currentDate.getFullYear();
    })
    ?.length * 15000 || 0;
  
  const monthlyRevenue = baseRevenueHUF * exchangeRates.RON;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Vezérlőpult</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Összes foglalás
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktív vendégek
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGuests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Program kihasználtság
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Havi bevétel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyRevenue.toLocaleString()} RON</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <ProgramManagement />
      </div>
    </div>
  );
}