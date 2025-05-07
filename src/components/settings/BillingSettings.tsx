
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

export function BillingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>
          Manage your subscription, payment methods, and billing history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Current Plan</h3>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">Pro Plan</p>
              <p className="text-sm text-muted-foreground">$49/month, billed monthly</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
              <span className="text-sm">Unlimited comments</span>
            </div>
            <div className="flex items-center">
              <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
              <span className="text-sm">Premium AI model access</span>
            </div>
            <div className="flex items-center">
              <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
              <span className="text-sm">Advanced analytics</span>
            </div>
            <div className="flex items-center">
              <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
              <span className="text-sm">Priority support</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Payment Method</h3>
          <div className="mt-2 flex items-center">
            <svg className="h-8 w-auto mr-2" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="40" rx="4" fill="#EEF0F3"/>
              <path d="M18.3 25.5H15L12.3 17.6C12.2336 17.3881 12.1195 17.1939 11.9665 17.0336C11.8135 16.8733 11.6262 16.7513 11.4212 16.6785C11.2162 16.6057 10.9986 16.5841 10.785 16.6151C10.5714 16.6462 10.3677 16.7291 10.19 16.857V16.5H5.75V25.5H9.025V18.275H10.832L13.985 25.5H18.3Z" fill="#3C4043"/>
              <path d="M19.4749 20.1502C19.4749 23.1252 21.7999 25.7252 24.9999 25.7252C27.0749 25.7252 28.3249 24.6502 28.3249 24.6502L27.4999 22.0252C27.4999 22.0252 26.5499 22.7752 25.3749 22.7752C24.1999 22.7752 23.1999 21.8752 23.1999 20.1502C23.1999 18.4252 24.1499 17.5252 25.3749 17.5252C26.5999 17.5252 27.4249 18.3002 27.4249 18.3002L28.2499 15.6252C28.2499 15.6252 27.0249 14.5752 24.9499 14.5752C21.7999 14.6002 19.4749 17.2002 19.4749 20.1502Z" fill="#3C4043"/>
              <path d="M35.2248 14.5752C32.0248 14.5752 29.6748 17.3002 29.6748 20.1502C29.6748 23.0002 32.0248 25.7252 35.2248 25.7252C38.4248 25.7252 40.7748 23.0002 40.7748 20.1502C40.7748 17.3002 38.4248 14.5752 35.2248 14.5752ZM35.2248 22.7252C33.9748 22.7252 33.0248 21.7002 33.0248 20.1502C33.0248 18.6002 33.9748 17.5752 35.2248 17.5752C36.4748 17.5752 37.4248 18.6002 37.4248 20.1502C37.4248 21.7002 36.4748 22.7252 35.2248 22.7252Z" fill="#3C4043"/>
              <path d="M53.9001 25.5V14.8252H51.1251L48.2751 21.0002H48.2001L45.3251 14.8252H42.5001V25.5H45.7751V20.5252H45.8251L48.1751 25.5H48.2501L50.6251 20.5252H50.6751V25.5H53.9001Z" fill="#3C4043"/>
            </svg>
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-xs text-muted-foreground">Expires 04/2025</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">
              Edit
            </Button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium">Billing History</h3>
          <div className="mt-2">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-b">
                <tr>
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">May 1, 2023</td>
                  <td className="py-3">Pro Plan - Monthly</td>
                  <td className="py-3 text-right">$49.00</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Apr 1, 2023</td>
                  <td className="py-3">Pro Plan - Monthly</td>
                  <td className="py-3 text-right">$49.00</td>
                </tr>
                <tr>
                  <td className="py-3">Mar 1, 2023</td>
                  <td className="py-3">Pro Plan - Monthly</td>
                  <td className="py-3 text-right">$49.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Button variant="link">View All Invoices</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
