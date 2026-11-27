type Props = {
  customers: any[];
  bgCard: string;
  setIsAddingCustomer: (value: boolean) => void;
  setEditingCustomer: (value: any) => void;
  setConfirmModal: (value: any) => void;
  currentUser: any;
  t: (key: string) => string;
};

export function CustomersView({ customers, bgCard, setIsAddingCustomer, setEditingCustomer, setConfirmModal, currentUser, t }: Props) {
  return <div className="space-y-4">
    <button onClick={() => setIsAddingCustomer(true)} className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white">+ {t('addClient')}</button>
    {customers.length === 0 ? <div className="rounded-2xl border border-dashed p-10 text-center opacity-60">{t('noClients')}</div> :
      <div className="grid gap-3 lg:grid-cols-2">{customers.map(customer =>
        <div key={customer.id} className={`p-4 rounded-2xl border flex justify-between items-center ${bgCard}`}>
          <div><p className="font-bold">{customer.name}</p><p className="text-xs opacity-50">{customer.phone || t('noPhone')}{customer.address ? ` • ${customer.address}` : ''}</p></div>
          <div className="flex gap-2">
            <button aria-label={t('editClient')} onClick={() => setEditingCustomer(customer)}>✎</button>
            {['admin','owner'].includes(currentUser?.role?.toLowerCase()) && <button aria-label={t('deleteClient')} onClick={() => setConfirmModal({ isOpen: true, type: 'delete_customer', id: customer.id, message: t('deleteClientConfirm') })} className="text-rose-500">⌫</button>}
          </div>
        </div>
      )}</div>}
  </div>;
}
