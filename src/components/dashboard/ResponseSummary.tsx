
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ResponseSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Summary</CardTitle>
        <CardDescription>
          Platform performance overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2">Platform</th>
                <th scope="col" className="px-3 py-2">Response</th>
                <th scope="col" className="px-3 py-2">Engagement</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <td className="px-3 py-2 font-medium">Instagram</td>
                <td className="px-3 py-2">90.5%</td>
                <td className="px-3 py-2 text-green-600">+24%</td>
              </tr>
              <tr className="bg-gray-50 border-b">
                <td className="px-3 py-2 font-medium">Facebook</td>
                <td className="px-3 py-2">89.3%</td>
                <td className="px-3 py-2 text-green-600">+18%</td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-3 py-2 font-medium">Google</td>
                <td className="px-3 py-2">100%</td>
                <td className="px-3 py-2 text-green-600">+32%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
