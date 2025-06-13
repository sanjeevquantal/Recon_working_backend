
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Zap } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReferenceDataPopupProps {
  recordId: string;
}

const ReferenceDataPopup: React.FC<ReferenceDataPopupProps> = ({ recordId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for the MVP
  const mockOffers = [
    { id: 'OFF-1001', title: 'Samsung EMI Program Q2', date: '2023-10-01' },
    { id: 'OFF-1002', title: 'Samsung Cashback Offer', date: '2023-10-05' },
    { id: 'OFF-1003', title: 'Samsung Festival Promotion', date: '2023-09-15' },
  ];
  
  const mockEmails = [
    { id: 'EM-1001', subject: 'Samsung EMI Reconciliation Report', date: '2023-10-10', from: 'reports@samsung.com' },
    { id: 'EM-1002', subject: 'Missing EMI Transactions', date: '2023-10-08', from: 'finance@samsung.com' },
    { id: 'EM-1003', subject: 'EMI Program Updates', date: '2023-10-05', from: 'updates@samsung.com' },
  ];

  const filteredOffers = searchTerm 
    ? mockOffers.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        offer.id.toLowerCase().includes(searchTerm.toLowerCase()))
    : mockOffers;

  const filteredEmails = searchTerm
    ? mockEmails.filter(email => 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
        email.from.toLowerCase().includes(searchTerm.toLowerCase()))
    : mockEmails;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Search className="h-4 w-4 mr-2" />
          Reference Data
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <h3 className="font-medium">Reference Data for Record #{recordId}</h3>
          
          <div className="relative">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers or emails..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="offers">
            <TabsList className="w-full">
              <TabsTrigger value="offers" className="flex-1">Offers</TabsTrigger>
              <TabsTrigger value="emails" className="flex-1">Emails</TabsTrigger>
            </TabsList>
            
            <TabsContent value="offers" className="max-h-64 overflow-y-auto">
              {filteredOffers.length > 0 ? (
                <ul className="divide-y">
                  {filteredOffers.map(offer => (
                    <li key={offer.id} className="py-2 hover:bg-muted/50 cursor-pointer rounded px-2">
                      <div className="font-medium">{offer.title}</div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{offer.id}</span>
                        <span>{offer.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No matching offers found
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="emails" className="max-h-64 overflow-y-auto">
              {filteredEmails.length > 0 ? (
                <ul className="divide-y">
                  {filteredEmails.map(email => (
                    <li key={email.id} className="py-2 hover:bg-muted/50 cursor-pointer rounded px-2">
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>{email.from}</span>
                        <span>{email.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No matching emails found
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReferenceDataPopup;
