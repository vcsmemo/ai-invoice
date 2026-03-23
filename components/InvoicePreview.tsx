'use client';

import { useState } from 'react';
import { Edit2, Download, FileText, Plus, Trash2, ChevronDown } from 'lucide-react';
import { InvoiceData } from '@/lib/supabase';
import { formatCurrency } from '@/lib/currencies';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  onEdit?: (data: InvoiceData) => void;
  onDownload?: () => void;
  isDownloading?: boolean;
}

export default function InvoicePreview({
  invoiceData,
  onEdit,
  onDownload,
  isDownloading = false,
}: InvoicePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<InvoiceData>(invoiceData);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSave = () => {
    onEdit?.(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(invoiceData);
    setIsEditing(false);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...editedData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    // Recalculate totals
    const newSubtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    let newTotal = newSubtotal;

    // Handle discount
    if (editedData.discount) {
      const discountAmount = editedData.discount.percent
        ? newSubtotal * (editedData.discount.percent / 100)
        : editedData.discount.amount;

      newTotal = newSubtotal - discountAmount;
    }

    // Handle tax
    if (editedData.tax && editedData.tax.rate > 0) {
      const taxAmount = newTotal * (editedData.tax.rate / 100);
      editedData.tax.amount = taxAmount;
      newTotal += taxAmount;
    }

    setEditedData({
      ...editedData,
      items: newItems,
      subtotal: newSubtotal,
      total: newTotal,
    });
  };

  const addItem = () => {
    const newItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };

    setEditedData({
      ...editedData,
      items: [...editedData.items, newItem],
    });
  };

  const removeItem = (index: number) => {
    const newItems = editedData.items.filter((_, i) => i !== index);
    const newSubtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    let newTotal = newSubtotal;

    if (editedData.tax && editedData.tax.rate > 0) {
      const taxAmount = newTotal * (editedData.tax.rate / 100);
      editedData.tax.amount = taxAmount;
      newTotal += taxAmount;
    }

    setEditedData({
      ...editedData,
      items: newItems,
      subtotal: newSubtotal,
      total: newTotal,
    });
  };

  const updateDiscount = (field: string, value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const discount: any = {
      ...editedData.discount,
      [field]: numValue,
    };

    // Calculate discount amount
    if (field === 'percent' || field === 'amount') {
      if (discount.percent) {
        discount.amount = editedData.subtotal * (discount.percent / 100);
      }
    }

    // Recalculate total
    let newTotal = editedData.subtotal - (discount.amount || 0);
    if (editedData.tax && editedData.tax.rate > 0) {
      const taxAmount = newTotal * (editedData.tax.rate / 100);
      editedData.tax.amount = taxAmount;
      newTotal += taxAmount;
    }

    setEditedData({
      ...editedData,
      discount,
      total: newTotal,
    });
  };

  const removeDiscount = () => {
    let newTotal = editedData.subtotal;
    if (editedData.tax && editedData.tax.rate > 0) {
      const taxableAmount = editedData.subtotal;
      const taxAmount = taxableAmount * (editedData.tax.rate / 100);
      editedData.tax.amount = taxAmount;
      newTotal += taxAmount;
    }

    setEditedData({
      ...editedData,
      discount: undefined,
      total: newTotal,
    });
  };

  const updateFrom = (field: string, value: string) => {
    setEditedData({
      ...editedData,
      from: {
        ...(editedData.from || { name: '' }),
        [field]: value,
      },
    });
  };

  const updateTax = (field: string, value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const tax = {
      ...editedData.tax,
      [field]: numValue,
    };

    // Calculate tax amount
    let taxableAmount = editedData.subtotal;
    if (editedData.discount) {
      taxableAmount -= editedData.discount.amount;
    }
    const safeTax: any = tax;
    safeTax.amount = taxableAmount * (safeTax.rate / 100);

    // Recalculate total
    const newTotal = taxableAmount + (tax as any).amount;

    setEditedData({
      ...editedData,
      tax: tax as any,
      total: newTotal,
    });
  };

  const calculateDueDate = (issueDate: string, terms: string) => {
    if (!issueDate) return '';
    const date = new Date(issueDate);
    if (isNaN(date.getTime())) return '';

    if (terms === 'Due on receipt') {
      return issueDate;
    }

    const days = parseInt(terms.replace('Net ', ''));
    if (isNaN(days)) return '';

    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-card rounded-[10px] border border-border overflow-hidden font-mono shadow-2xl relative">
      {/* ... (existing code remains same until the select) */}
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          invoice-preview --readonly
        </div>
        <div className="w-10" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-widest">$ view doc</span>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-bold text-foreground bg-secondary border border-border rounded-[6px] hover:bg-muted transition-colors flex items-center gap-1.5 uppercase tracking-tighter"
              >
                <Edit2 className="w-3 h-3" />
                edit
              </button>
              <button
                onClick={onDownload}
                disabled={isDownloading}
                className="px-3 py-1.5 text-xs font-bold text-primary-foreground bg-primary rounded-[6px] hover:opacity-90 disabled:bg-secondary disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 uppercase tracking-tighter glow-accent"
              >
                <Download className="w-3 h-3" />
                {isDownloading ? 'generating...' : 'export pdf'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-bold text-foreground bg-secondary border border-border rounded-[6px] hover:bg-muted transition-colors uppercase tracking-tighter"
              >
                cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-bold text-primary-foreground bg-primary rounded-[6px] hover:opacity-90 transition-colors uppercase tracking-tighter glow-accent"
              >
                save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8 space-y-6">
        {/* Logo and Hero Section */}
        <div className="flex justify-between items-start border-b border-border/30 pb-8 mb-8">
          <div>
            {(editedData.from?.logo || (editedData.from as any)?.logo_url) ? (
              <img 
                src={editedData.from?.logo || (editedData.from as any).logo_url} 
                alt="Logo" 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {editedData.from?.company?.substring(0, 2).toUpperCase() || 'AI'}
                </span>
              </div>
            )}
            <div className="mt-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"># invoice_id</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.invoice.invoiceNumber}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      invoice: { ...editedData.invoice, invoiceNumber: e.target.value },
                    })
                  }
                  className="mt-1 px-2 py-1 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              ) : (
                <p className="text-xs font-bold text-primary mt-0.5">{editedData.invoice.invoiceNumber}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold tracking-tighter text-foreground mb-1">INVOICE</h2>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount Due</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(editedData.total, editedData.invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Project Meta */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1"># po_number</label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.invoice.poNumber || ''}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    invoice: { ...editedData.invoice, poNumber: e.target.value },
                  })
                }
                placeholder="Optional"
                className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            ) : (
              <p className="text-xs font-bold text-foreground">{editedData.invoice.poNumber || '-'}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1"># payment_terms</label>
            {isEditing ? (
              <select
                value={editedData.invoice.paymentTerms || 'Net 30'}
                onChange={(e) => {
                  const newTerms = e.target.value;
                  const newDueDate = calculateDueDate(editedData.invoice.issueDate, newTerms);
                  setEditedData({
                    ...editedData,
                    invoice: { 
                      ...editedData.invoice, 
                      paymentTerms: newTerms,
                      dueDate: newDueDate || editedData.invoice.dueDate
                    },
                  });
                }}
                className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              >
                <option value="Due on receipt">receipt</option>
                <option value="Net 15">net_15</option>
                <option value="Net 30">net_30</option>
                <option value="Net 60">net_60</option>
              </select>
            ) : (
              <p className="text-xs font-bold text-foreground">{editedData.invoice.paymentTerms || 'Net 30'}</p>
            )}
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Billing From */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">$ billing-from</h3>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedData.from?.name || ''}
                  onChange={(e) => updateFrom('name', e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <input
                  type="text"
                  value={editedData.from?.company || ''}
                  onChange={(e) => updateFrom('company', e.target.value)}
                  placeholder="Your Company"
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <input
                  type="email"
                  value={editedData.from?.email || ''}
                  onChange={(e) => updateFrom('email', e.target.value)}
                  placeholder="Your Email"
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <textarea
                  value={editedData.from?.address || ''}
                  onChange={(e) => updateFrom('address', e.target.value)}
                  placeholder="Your Address"
                  rows={2}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none"
                />
              </div>
            ) : (
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">{editedData.from?.name || 'Sender Name'}</p>
                {editedData.from?.company && <p className="text-muted-foreground">{editedData.from.company}</p>}
                {editedData.from?.email && <p className="text-muted-foreground">{editedData.from.email}</p>}
                {editedData.from?.address && <p className="text-muted-foreground whitespace-pre-line">{editedData.from.address}</p>}
              </div>
            )}
          </div>

          {/* Billing To */}
          <div>
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">$ billing-to</h3>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedData.customer.name}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      customer: { ...editedData.customer, name: e.target.value },
                    })
                  }
                  placeholder="Customer Name"
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <input
                  type="text"
                  value={editedData.customer.company || ''}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      customer: { ...editedData.customer, company: e.target.value },
                    })
                  }
                  placeholder="Customer Company"
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <input
                  type="email"
                  value={editedData.customer.email || ''}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      customer: { ...editedData.customer, email: e.target.value },
                    })
                  }
                  placeholder="Customer Email"
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <textarea
                  value={editedData.customer.address || ''}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      customer: { ...editedData.customer, address: e.target.value },
                    })
                  }
                  placeholder="Customer Address"
                  rows={2}
                  className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none"
                />
              </div>
            ) : (
              <div className="text-xs space-y-1">
                <p className="font-bold text-foreground">{editedData.customer.name}</p>
                {editedData.customer.company && <p className="text-muted-foreground">{editedData.customer.company}</p>}
                {editedData.customer.email && <p className="text-muted-foreground">{editedData.customer.email}</p>}
                {editedData.customer.address && <p className="text-muted-foreground whitespace-pre-line">{editedData.customer.address}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wide">Items</h3>
            {isEditing && (
              <button
                onClick={addItem}
                className="px-2 py-1 text-xs font-medium text-[rgb(8,8,8)] bg-[rgb(200,245,66)] rounded hover:bg-[rgb(180,230,60)] transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Item
              </button>
            )}
          </div>
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-24">Qty</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-32">Price</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-32">Total</th>
                  {isEditing && <th className="w-10"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {editedData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                        />
                      ) : (
                        <span className="text-xs text-foreground">{item.description}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                        />
                      ) : (
                        <span className="text-xs text-foreground">{item.quantity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground text-right focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-xs text-foreground">{formatCurrency(item.unitPrice, editedData.invoice.currency)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs font-bold text-foreground">{formatCurrency(item.total, editedData.invoice.currency)}</span>
                    </td>
                    {isEditing && (
                      <td className="px-2 py-3">
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discount */}
        {isEditing ? (
          <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
            {editedData.discount ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-foreground">Discount</h4>
                  <button
                    onClick={removeDiscount}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</label>
                    <select
                      value={editedData.discount.percent !== undefined ? 'percent' : 'fixed'}
                      onChange={(e) => {
                        const isPercent = e.target.value === 'percent';
                        updateDiscount('percent', isPercent ? 10 : (undefined as any));
                        updateDiscount('amount', isPercent ? (undefined as any) : 0);
                      }}
                      className="w-full mt-1 px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    >
                      <option value="percent">Percent (%)</option>
                      <option value="fixed">Fixed ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Value</label>
                    <input
                      type="number"
                      value={editedData.discount.percent !== undefined ? editedData.discount.percent : editedData.discount.amount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (editedData.discount && editedData.discount.percent !== undefined) {
                          updateDiscount('percent', value);
                        } else {
                          updateDiscount('amount', value);
                        }
                      }}
                      className="w-full mt-1 px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase">Amount</p>
                    <p className="text-sm font-bold text-primary">-{formatCurrency(editedData.discount.amount, editedData.invoice.currency)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => updateDiscount('percent', 0)}
                className="w-full py-2 text-xs font-bold text-muted-foreground border border-dashed border-border rounded hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <Plus className="w-4 h-4" />
                Add Discount
              </button>
            )}
          </div>
        ) : (
          editedData.discount && (
            <div className="flex justify-end">
              <div className="w-56">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">
                    Discount {editedData.discount.percent ? `(${editedData.discount.percent}%)` : ''}
                  </span>
                  <span className="text-primary">-{formatCurrency(editedData.discount.amount, editedData.invoice.currency)}</span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-3 bg-muted/30 p-4 rounded-[10px] border border-border/50">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-muted-foreground uppercase tracking-widest">subtotal:</span>
              <span className="text-foreground">{formatCurrency(editedData.subtotal, editedData.invoice.currency)}</span>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editedData.tax?.rate || 0}
                  onChange={(e) => updateTax('rate', e.target.value)}
                  className="w-12 px-1.5 py-1 bg-background border border-border rounded-[4px] text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  step="0.1"
                />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">% tax:</span>
                <span className="font-bold text-foreground ml-auto text-[10px]">
                  {formatCurrency(editedData.tax?.amount || 0, editedData.invoice.currency)}
                </span>
              </div>
            ) : (
              editedData.tax && editedData.tax.rate > 0 && (
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-muted-foreground uppercase tracking-widest">
                    tax_{editedData.tax.rate}%:
                  </span>
                  <span className="text-foreground">{formatCurrency(editedData.tax.amount, editedData.invoice.currency)}</span>
                </div>
              )
            )}

            <div className="flex justify-between text-base font-bold pt-3 border-t border-border text-primary">
              <span className="uppercase tracking-widest text-[10px] mt-1">total:</span>
              <span className="text-xl">{formatCurrency(editedData.total, editedData.invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"># issue_date</p>
            {isEditing ? (
              <input
                type="date"
                value={editedData.invoice.issueDate}
                onChange={(e) => {
                  const newIssueDate = e.target.value;
                  const newDueDate = calculateDueDate(newIssueDate, editedData.invoice.paymentTerms || 'Net 30');
                  setEditedData({
                    ...editedData,
                    invoice: { 
                      ...editedData.invoice, 
                      issueDate: newIssueDate,
                      dueDate: newDueDate || editedData.invoice.dueDate
                    },
                  });
                }}
                className="mt-1 px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            ) : (
              <p className="text-xs font-bold text-foreground mt-1">{editedData.invoice.issueDate}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"># due_date</p>
            {isEditing ? (
              <input
                type="date"
                value={editedData.invoice.dueDate || ''}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    invoice: { ...editedData.invoice, dueDate: e.target.value },
                  })
                }
                className="mt-1 px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            ) : (
              <p className="text-xs font-bold text-foreground mt-1">
                {editedData.invoice.dueDate || 'Not set'}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        {isEditing && (
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
              $ notes --optional
            </label>
            <textarea
              value={editedData.invoice.notes || ''}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  invoice: { ...editedData.invoice, notes: e.target.value },
                })
              }
              placeholder="Payment terms, thank you note, etc."
              rows={3}
              className="w-full px-2 py-1.5 bg-background border border-border rounded-[4px] text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
