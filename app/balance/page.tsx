import { createClient } from '@/lib/supabase-server'
import { AddBalanceForm } from '@/components/AddBalanceForm'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function BalancePage() {
  const supabase = await createClient()
  
  const { data: history } = await supabase
    .from('balance_entries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="pt-2 pb-2">
        <h1 className="font-fraunces text-header-display text-[#F2EFEA]">Balance</h1>
        <div style={{ width: '40px', height: '3px', backgroundColor: '#E17A4D', borderRadius: '2px', marginTop: '6px' }} />
        <p className="text-body-muted-luma mt-2">Manage your wallet balance and view history</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddBalanceForm />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="glass-card shadow-md">
            <CardHeader>
              <CardTitle className="text-header-section">Balance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="solid-list-card">
                <Table>
                  <TableHeader className="bg-[#2B2C33]">
                    <TableRow className="border-b border-[rgba(255,255,255,0.09)]">
                      <TableHead className="font-fraunces text-[#8A8790]">Date</TableHead>
                      <TableHead className="font-fraunces text-[#8A8790]">Type</TableHead>
                      <TableHead className="font-fraunces text-[#8A8790]">Note</TableHead>
                      <TableHead className="font-fraunces text-[#8A8790] text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history && history.length > 0 ? (
                      history.map((entry) => (
                        <TableRow
                          key={entry.id}
                          className="border-b border-[rgba(255,255,255,0.06)] hover:bg-[#2B2C33]/50 transition-colors"
                          style={entry.type === 'credit' ? { borderLeft: '3px solid #7FB69E' } : undefined}
                        >
                          <TableCell className="text-body-muted-luma text-xs whitespace-nowrap font-inter font-tnum">
                            {format(new Date(entry.created_at), 'dd MMM yyyy, h:mm a')}
                          </TableCell>
                          <TableCell>
                            {entry.type === 'credit' ? (
                              <Badge className="badge-success-luma border-none shadow-none font-medium">Credit</Badge>
                            ) : (
                              <Badge className="badge-danger-luma border-none shadow-none font-medium">Debit</Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate text-body-muted-luma text-xs">{entry.note || '-'}</TableCell>
                          <TableCell
                            className={`text-right font-inter font-bold font-tnum text-sm ${entry.type === 'credit' ? 'text-[#7FB69E]' : 'text-[#C4595A]'}`}
                          >
                            {entry.type === 'credit' ? '+' : '-'}₹{Number(entry.amount).toLocaleString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-32 text-body-muted-luma">
                          No history found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
