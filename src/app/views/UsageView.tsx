import { useState } from 'react';
import { CreditCard, Download, Plus, Trash2, Building2, Sparkles, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { CardContent } from '../components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '../components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import SlideInPanel from '../components/SlideInPanel';
import { cn } from '../components/ui/utils';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface PaymentMethod {
  id: string;
  type: 'credit-card' | 'pix';
  last4?: string;
  brand?: string;
  cardholderName?: string;
  expiryDate?: string;
  pixKey?: string;
  pixKeyType?: string;
  isDefault: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

interface Player {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

const mockMembers: Member[] = [
  { id: 'member1', name: 'John Anderson', email: 'john.anderson@company.com', joinDate: 'Jan 15, 2022' },
  { id: 'member2', name: 'Sarah Williams', email: 'sarah.williams@company.com', joinDate: 'Feb 20, 2022' },
  { id: 'member3', name: 'Michael Brown', email: 'michael.brown@company.com', joinDate: 'Mar 10, 2022' },
  { id: 'member4', name: 'Emily Davis', email: 'emily.davis@company.com', joinDate: 'Apr 5, 2022' },
  { id: 'member5', name: 'David Martinez', email: 'david.martinez@company.com', joinDate: 'May 12, 2022' },
  { id: 'member6', name: 'Jessica Taylor', email: 'jessica.taylor@company.com', joinDate: 'Jun 18, 2022' },
  { id: 'member7', name: 'Robert Johnson', email: 'robert.johnson@company.com', joinDate: 'Jul 22, 2022' },
  { id: 'member8', name: 'Amanda White', email: 'amanda.white@company.com', joinDate: 'Aug 30, 2022' },
  { id: 'member9', name: 'Christopher Lee', email: 'christopher.lee@company.com', joinDate: 'Sep 14, 2022' },
  { id: 'member10', name: 'Michelle Garcia', email: 'michelle.garcia@company.com', joinDate: 'Oct 8, 2022' },
  { id: 'member11', name: 'Kevin Rodriguez', email: 'kevin.rodriguez@company.com', joinDate: 'Nov 20, 2022' },
  { id: 'member12', name: 'Laura Martinez', email: 'laura.martinez@company.com', joinDate: 'Jan 11, 2023' },
  { id: 'member13', name: 'Daniel Kim', email: 'daniel.kim@company.com', joinDate: 'Feb 25, 2023' },
  { id: 'member14', name: 'Rachel Green', email: 'rachel.green@company.com', joinDate: 'Mar 17, 2023' },
  { id: 'member15', name: 'Thomas Wright', email: 'thomas.wright@company.com', joinDate: 'Apr 29, 2023' },
];

const mockPlayers: Player[] = [
  { id: 'player1', name: 'Marcus Chen', email: 'marcus@poker.com', joinDate: 'Mar 1, 2026' },
  { id: 'player2', name: 'Sarah Mitchell', email: 'sarah.mitchell@poker.com', joinDate: 'Mar 5, 2026' },
  { id: 'player3', name: 'David Rodriguez', email: 'david.r@poker.com', joinDate: 'Mar 8, 2026' },
  { id: 'player4', name: 'Alex Thompson', email: 'alex.t@poker.com', joinDate: 'Mar 10, 2026' },
  { id: 'player5', name: 'Emma Wilson', email: 'emma.w@poker.com', joinDate: 'Mar 12, 2026' },
  { id: 'player6', name: 'James Parker', email: 'james.p@poker.com', joinDate: 'Mar 15, 2026' },
  { id: 'player7', name: 'Michael Chen', email: 'michael.c@poker.com', joinDate: 'Mar 18, 2026' },
  { id: 'player8', name: 'Lisa Anderson', email: 'lisa.a@poker.com', joinDate: 'Mar 20, 2026' },
  { id: 'player9', name: 'Robert Kim', email: 'robert.k@poker.com', joinDate: 'Mar 22, 2026' },
  { id: 'player10', name: 'Jennifer Lee', email: 'jennifer.l@poker.com', joinDate: 'Mar 25, 2026' },
  { id: 'player11', name: 'Tom Bradley', email: 'tom.b@poker.com', joinDate: 'Mar 27, 2026' },
  { id: 'player12', name: 'Nina Patel', email: 'nina.p@poker.com', joinDate: 'Mar 28, 2026' },
  { id: 'player13', name: 'Carlos Rivera', email: 'carlos.r@poker.com', joinDate: 'Mar 29, 2026' },
  { id: 'player14', name: 'Sophia Martinez', email: 'sophia.m@poker.com', joinDate: 'Mar 30, 2026' },
  { id: 'player15', name: "Ryan O'Connor", email: 'ryan.o@poker.com', joinDate: 'Mar 31, 2026' },
];

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2026-001', date: '2026-04-01', amount: 49.99, status: 'paid' },
  { id: '2', invoiceNumber: 'INV-2026-002', date: '2026-03-01', amount: 49.99, status: 'paid' },
  { id: '3', invoiceNumber: 'INV-2026-003', date: '2026-02-01', amount: 49.99, status: 'paid' },
  { id: '4', invoiceNumber: 'INV-2026-004', date: '2026-01-01', amount: 49.99, status: 'paid' },
  { id: '5', invoiceNumber: 'INV-2025-012', date: '2025-12-01', amount: 49.99, status: 'paid' },
  { id: '6', invoiceNumber: 'INV-2025-011', date: '2025-11-01', amount: 49.99, status: 'paid' },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: '1', type: 'credit-card', last4: '4242', brand: 'Visa', cardholderName: 'MARCUS CHEN', expiryDate: '12/27', isDefault: true },
  { id: '2', type: 'credit-card', last4: '8888', brand: 'Mastercard', cardholderName: 'MARCUS CHEN', expiryDate: '06/26', isDefault: false },
  { id: '3', type: 'credit-card', last4: '1234', brand: 'Amex', cardholderName: 'MARCUS CHEN', expiryDate: '09/28', isDefault: false },
  { id: '4', type: 'pix', pixKey: 'marcus@email.com', pixKeyType: 'email', isDefault: false },
];

const cardBrandConfig: Record<string, { gradient: string; logo: string }> = {
  Visa: { gradient: 'from-blue-600 via-blue-700 to-blue-800', logo: 'VISA' },
  Mastercard: { gradient: 'from-orange-500 via-red-600 to-orange-700', logo: 'Mastercard' },
  Amex: { gradient: 'from-cyan-500 via-blue-600 to-cyan-700', logo: 'AMEX' },
  default: { gradient: 'from-slate-600 via-slate-700 to-slate-800', logo: 'Card' },
};

function detectCardBrand(number: string): string {
  const num = number.replace(/\s/g, '');
  if (num.startsWith('4')) return 'Visa';
  if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard';
  if (num.startsWith('34') || num.startsWith('37')) return 'Amex';
  return 'default';
}

function CreditCardDisplay({ method }: { method: PaymentMethod }) {
  const formatCardNumber = (num: string) => {
    return num.padStart(16, '*').replace(/(.{4})/g, '$1 ').trim();
  };

  const config = cardBrandConfig[method.brand || ''] || cardBrandConfig.default;

  return (
    <div className={cn("relative w-full aspect-[316/190] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br", config.gradient)}>
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="text-xl font-bold tracking-wider text-white">
            {config.logo}
          </div>
          {method.isDefault && (
            <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full backdrop-blur">Default</span>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="font-mono text-xl tracking-widest text-white/90">
            {formatCardNumber(method.last4 || '****')}
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Cardholder</div>
              <div className="text-sm font-medium text-white">{method.cardholderName}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Expires</div>
              <div className="text-sm font-medium text-white">{method.expiryDate}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-white/30 via-white to-white/30" />
    </div>
  );
}

function PixCardDisplay({ method }: { method: PaymentMethod }) {
  const pixTypeLabels: Record<string, string> = {
    email: 'Email',
    cpf: 'CPF',
    phone: 'Phone',
    random: 'Random Key',
  };

  return (
    <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 border border-emerald-400">
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {method.isDefault && (
            <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">Default</span>
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-white/20 text-white text-xs rounded">PIX</span>
            <span className="text-white/60 text-xs">Instant</span>
          </div>
          
          <div>
            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5">Key</div>
            <div className="text-base font-medium text-white truncate">{method.pixKey}</div>
          </div>
          
          <div className="text-sm font-medium text-white/80">{pixTypeLabels[method.pixKeyType || 'email']}</div>
        </div>
      </div>
    </div>
  );
}

export default function UsageView() {
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<'credit-card' | 'pix'>('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('email');
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPage, setMembersPage] = useState(1);
  const [playersPage, setPlayersPage] = useState(1);
  const itemsPerPage = 5;
  const membersPerPage = 5;
  const playersPerPage = 5;

  const monthlySubscription = 49.99;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const paginatedInvoices = invoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const creditCards = paymentMethods.filter(pm => pm.type === 'credit-card');
  const pixMethods = paymentMethods.filter(pm => pm.type === 'pix');

  const membersTotalPages = Math.ceil(mockMembers.length / membersPerPage);
  const paginatedMembers = mockMembers.slice((membersPage - 1) * membersPerPage, membersPage * membersPerPage);
  
  const playersTotalPages = Math.ceil(mockPlayers.length / playersPerPage);
  const paginatedPlayers = mockPlayers.slice((playersPage - 1) * playersPerPage, playersPage * playersPerPage);

  const handleDownloadInvoice = (invoice: Invoice) => {
    const mockPdfContent = `
      INVOICE
      ----------------------------------------
      Invoice #: ${invoice.invoiceNumber}
      Date: ${invoice.date}
      Amount: $${invoice.amount.toFixed(2)}
      Status: ${invoice.status.toUpperCase()}
      
      Thank you for your subscription!
    `;
    
    const blob = new Blob([mockPdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddPaymentMethod = () => {
    const brand = newPaymentType === 'credit-card' ? detectCardBrand(cardNumber) : 'PIX';
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentType,
      isDefault: paymentMethods.length === 0,
      ...(newPaymentType === 'credit-card' 
        ? { 
            last4: cardNumber.slice(-4) || '0000', 
            brand: brand === 'default' ? 'Visa' : brand,
            cardholderName: cardName.toUpperCase(),
            expiryDate: cardExpiry
          }
        : { pixKey, pixKeyType }
      ),
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAddPaymentOpen(false);
    resetForm();
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const resetForm = () => {
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardName('');
    setPixKey('');
    setPixKeyType('email');
    setNewPaymentType('credit-card');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Usage</h1>
        <p className="text-gray-500 mt-1">Manage your subscription, invoices, and payment methods</p>
      </div>

      <div className="grid gap-6">
        {/* Subscription Summary */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 text-sm font-medium tracking-wide uppercase">Active Plan</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-800">GrindSafe - Subscription</h2>
              <p className="text-slate-500 text-sm mt-1">Your premium subscription</p>
            </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
        </div>

        {/* Members & Players 50/50 Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Members */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Members</h3>
                <p className="text-sm text-slate-500">Team members with access</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer border-slate-200 hover:bg-slate-900 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Invite
              </Button>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Total: </span>
              <span className="text-sm font-bold text-slate-800">{mockMembers.length} × $49.99 = ${(mockMembers.length * 49.99).toFixed(2)}/mo</span>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {paginatedMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{member.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              {membersTotalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setMembersPage(p => Math.max(1, p - 1))}
                          className={membersPage === 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: membersTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={membersPage === page}
                            onClick={() => setMembersPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setMembersPage(p => Math.min(membersTotalPages, p + 1))}
                          className={membersPage === membersTotalPages ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>

          {/* Players */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Players</h3>
                <p className="text-sm text-slate-500">Tracked player accounts</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer border-slate-200 hover:bg-slate-900 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Invite
              </Button>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">Total: </span>
              <span className="text-sm font-bold text-slate-800">{mockPlayers.length} × $49.99 = ${(mockPlayers.length * 49.99).toFixed(2)}/mo</span>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {paginatedPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{player.name}</p>
                        <p className="text-xs text-slate-500">{player.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{player.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              {playersTotalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setPlayersPage(p => Math.max(1, p - 1))}
                          className={playersPage === 1 ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: playersTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={playersPage === page}
                            onClick={() => setPlayersPage(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setPlayersPage(p => Math.min(playersTotalPages, p + 1))}
                          className={playersPage === playersTotalPages ? "pointer-events-none opacity-50 cursor-pointer" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-lg font-semibold text-slate-800">Invoice History</h3>
            <p className="text-sm text-slate-500">Download your past invoices</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-slate-600 font-semibold">Invoice #</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Date</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Amount</TableHead>
                    <TableHead className="text-slate-600 font-semibold">Status</TableHead>
                    <TableHead className="text-right text-slate-600 font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice, idx) => (
                    <TableRow key={invoice.id} className={cn("hover:bg-slate-50/50", idx % 2 === 0 ? "bg-white" : "bg-slate-50/30")}>
                      <TableCell className="font-mono font-medium text-slate-800">{invoice.invoiceNumber}</TableCell>
                      <TableCell className="text-slate-600">{invoice.date}</TableCell>
                      <TableCell className="font-semibold text-slate-800">${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
                          invoice.status === 'paid' 
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                            : invoice.status === 'pending'
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", 
                            invoice.status === 'paid' ? "bg-emerald-500" : invoice.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                          )} />
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all"
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h3 className="text-lg font-semibold text-slate-800">Payment Methods</h3>
            <p className="text-sm text-slate-500">Manage your payment options</p>
          </div>
          <CardContent className="p-6 space-y-8">
            {/* Credit Cards Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  Credit/Debit Cards
                </h4>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="cursor-pointer border-slate-200 hover:bg-slate-900 hover:text-white"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Payment
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onSelect={(e) => { e.preventDefault(); setNewPaymentType('credit-card'); setIsAddPaymentOpen(true); }}
                      className="cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Credit/Debit Card
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onSelect={(e) => { e.preventDefault(); setNewPaymentType('pix'); setIsAddPaymentOpen(true); }}
                      className="cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      PIX Key
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {creditCards.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">No cards added yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {creditCards.map((card) => (
                    <div key={card.id} className="group relative">
                      <CreditCardDisplay method={card} />
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!card.isDefault && (
                          <button
                            onClick={() => handleSetDefault(card.id)}
                            className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
                            title="Set as default"
                          >
                            <Check className="w-4 h-4 text-slate-600" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePaymentMethod(card.id)}
                          className="p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-red-50 transition-colors"
                          title="Remove card"
                        >
                          <Trash2 className="w-4 h-4 text-slate-600 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PIX Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-600" />
                  PIX
                </h4>
              </div>
              
              {pixMethods.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-sm">No PIX keys added yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pixMethods.map((pix) => (
                    <div key={pix.id} className="group relative">
                      <PixCardDisplay method={pix} />
                      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!pix.isDefault && (
                          <button
                            onClick={() => handleSetDefault(pix.id)}
                            className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-md border border-white/20 hover:bg-white transition-colors"
                            title="Set as default"
                          >
                            <Check className="w-4 h-4 text-white/70" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePaymentMethod(pix.id)}
                          className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-md border border-white/20 hover:bg-red-50 transition-colors"
                          title="Remove PIX key"
                        >
                          <Trash2 className="w-4 h-4 text-white/70 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </div>

      {/* Add Payment Slide-in Panel */}
      <SlideInPanel
        isOpen={isAddPaymentOpen}
        onClose={() => { setIsAddPaymentOpen(false); resetForm(); }}
        title={newPaymentType === 'credit-card' ? 'Add Credit Card' : 'Add PIX Key'}
      >
        {newPaymentType === 'credit-card' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-name" className="text-slate-700">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="JOHN DOE"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="border-slate-200 bg-slate-50 uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-number" className="text-slate-700">Card Number</Label>
              <Input
                id="card-number"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="border-slate-200 bg-slate-50 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="card-expiry" className="text-slate-700">Expiry</Label>
                <Input
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="border-slate-200 bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-cvv" className="text-slate-700">CVV</Label>
                <Input
                  id="card-cvv"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  type="password"
                  className="border-slate-200 bg-slate-50"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => { setIsAddPaymentOpen(false); resetForm(); }}
                className="cursor-pointer border-slate-200 flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddPaymentMethod} 
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 flex-1"
              >
                Add Card
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-700">PIX Key Type</Label>
              <Select value={pixKeyType} onValueChange={setPixKeyType}>
                <SelectTrigger className="border-slate-200 bg-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="random">Random Key</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700">PIX Key</Label>
              <Input
                placeholder={pixKeyType === 'random' ? 'Generated key' : `Enter your ${pixKeyType}`}
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                disabled={pixKeyType === 'random'}
                className="border-slate-200 bg-slate-50"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => { setIsAddPaymentOpen(false); resetForm(); }}
                className="cursor-pointer border-slate-200 flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddPaymentMethod} 
                className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 flex-1"
              >
                Add PIX Key
              </Button>
            </div>
          </div>
        )}
      </SlideInPanel>
    </div>
  );
}