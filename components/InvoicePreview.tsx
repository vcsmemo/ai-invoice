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
      const taxAmount = newTotal * (editedData.tax.rate / 100);
      editedData.tax.amount = taxAmount;
      newTotal += taxAmount;
    }

    setEditedData({
      ...editedData,
      discount: undefined,
      total: newTotal,
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

  return (
    <div className="bg-[rgb(24,24,24)] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[rgb(180,180,180)]" />
          <span className="text-sm font-medium text-[rgb(250,250,250)]">Invoice Preview</span>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-medium text-[rgb(250,250,250)] bg-[rgb(32,32,32)] border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgb(40,40,40)] transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={onDownload}
                disabled={isDownloading}
                className="px-3 py-1.5 text-xs font-medium text-[rgb(8,8,8)] bg-[rgb(200,245,66)] rounded-lg hover:bg-[rgb(180,230,60)] disabled:bg-[rgb(40,40,40)] disabled:text-[rgb(80,80,80)] disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs font-medium text-[rgb(250,250,250)] bg-[rgb(32,32,32)] border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgb(40,40,40)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs font-medium text-[rgb(8,8,8)] bg-[rgb(200,245,66)] rounded-lg hover:bg-[rgb(180,230,60)] transition-colors"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Content */}
      <div className="p-8 space-y-6">
        {/* Invoice Number & Meta */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wide">Invoice #</label>
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
                className="w-full mt-1 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
              />
            ) : (
              <p className="text-sm font-medium text-[rgb(250,250,250)] mt-1">{editedData.invoice.invoiceNumber}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wide">PO Number</label>
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
                className="w-full mt-1 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
              />
            ) : (
              <p className="text-sm font-medium text-[rgb(250,250,250)] mt-1">{editedData.invoice.poNumber || '-'}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wide">Payment Terms</label>
            {isEditing ? (
              <select
                value={editedData.invoice.paymentTerms || 'Net 30'}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    invoice: { ...editedData.invoice, paymentTerms: e.target.value },
                  })
                }
                className="w-full mt-1 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
              >
                <option value="Due on receipt">Due on receipt</option>
                <option value="Net 15">Net 15 days</option>
                <option value="Net 30">Net 30 days</option>
                <option value="Net 60">Net 60 days</option>
                <option value="Net 90">Net 90 days</option>
              </select>
            ) : (
              <p className="text-sm font-medium text-[rgb(250,250,250)] mt-1">{editedData.invoice.paymentTerms || 'Net 30'}</p>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wide mb-3">Bill To</h3>
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
                className="w-full px-3 py-2 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
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
                placeholder="Company"
                className="w-full px-3 py-2 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
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
                placeholder="Email"
                className="w-full px-3 py-2 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
              />
              <textarea
                value={editedData.customer.address || ''}
                onChange={(e) =>
                  setEditedData({
                    ...editedData,
                    customer: { ...editedData.customer, address: e.target.value },
                  })
                }
                placeholder="Address"
                rows={2}
                className="w-full px-3 py-2 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)] resize-none"
              />
            </div>
          ) : (
            <div>
              <p className="font-medium text-[rgb(250,250,250)]">{editedData.customer.name}</p>
              {editedData.customer.company && (
                <p className="text-sm text-[rgb(180,180,180)] mt-1">{editedData.customer.company}</p>
              )}
              {editedData.customer.email && (
                <p className="text-sm text-[rgb(180,180,180)]">{editedData.customer.email}</p>
              )}
              {editedData.customer.address && (
                <p className="text-sm text-[rgb(180,180,180)] whitespace-pre-line mt-1">{editedData.customer.address}</p>
              )}
            </div>
          )}
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
          <div className="border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[rgb(20,20,20)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[rgb(180,180,180)]">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[rgb(180,180,180)] w-24">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[rgb(180,180,180)] w-32">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[rgb(180,180,180)] w-32">Total</th>
                  {isEditing && <th className="w-10"></th>}
                </tr>
              </thead>
              <tbody>
                {editedData.items.map((item, index) => (
                  <tr key={index} className="border-t border-[rgba(255,255,255,0.08)]">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
                        />
                      ) : (
                        <span className="text-sm text-[rgb(250,250,250)]">{item.description}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] text-center focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
                        />
                      ) : (
                        <span className="text-sm text-[rgb(250,250,250)]">{item.quantity}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] text-right focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm text-[rgb(250,250,250)]">{formatCurrency(item.unitPrice, editedData.invoice.currency)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-[rgb(250,250,250)]">{formatCurrency(item.total, editedData.invoice.currency)}</span>
                    </td>
                    {isEditing && (
                      <td className="px-2 py-3">
                        <button
                          onClick={() => removeItem(index)}
                          className="p-1 text-[rgb(180,180,180)] hover:text-[rgb(239,68,68)] transition-colors"
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
          <div className="p-4 bg-[rgb(20,20,20)] rounded-lg border border-[rgba(255,255,255,0.08)]">
            {editedData.discount ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[rgb(250,250,250)]">Discount</h4>
                  <button
                    onClick={removeDiscount}
                    className="p-1 text-[rgb(180,180,180)] hover:text-[rgb(239,68,68)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-[rgb(180,180,180)]">Type</label>
                    <select
                      value={editedData.discount.percent !== undefined ? 'percent' : 'fixed'}
                      onChange={(e) => {
                        const isPercent = e.target.value === 'percent';
                        updateDiscount('percent', isPercent ? 10 : (undefined as any));
                        updateDiscount('amount', isPercent ? (undefined as any) : 0);
                      }}
                      className="w-full mt-1 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
                    >
                      <option value="percent">Percent (%)</option>
                      <option value="fixed">Fixed ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[rgb(180,180,180)]">Value</label>
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
                      className="w-full mt-1 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[rgb(180,180,180)] mt-1">Amount</p>
                    <p className="text-sm font-semibold text-[rgb(200,245,66)]">-{formatCurrency(editedData.discount.amount, editedData.invoice.currency)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => updateDiscount('percent', 0)}
                className="w-full py-2 text-sm text-[rgb(180,180,180)] border border-dashed border-[rgba(255,255,255,0.2)] rounded hover:border-[rgb(200,245,66)] hover:text-[rgb(200,245,66)] transition-colors flex items-center justify-center gap-2"
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
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(180,180,180)]">
                    Discount {editedData.discount.percent ? `(${editedData.discount.percent}%)` : ''}
                  </span>
                  <span className="font-medium text-[rgb(200,245,66)]">-{formatCurrency(editedData.discount.amount, editedData.invoice.currency)}</span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-56 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[rgb(180,180,180)]">Subtotal</span>
              <span className="font-medium text-[rgb(250,250,250)]">{formatCurrency(editedData.subtotal, editedData.invoice.currency)}</span>
            </div>

            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editedData.tax?.rate || 0}
                  onChange={(e) => updateTax('rate', e.target.value)}
                  className="w-16 px-2 py-1 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
                  step="0.1"
                />
                <span className="text-sm text-[rgb(180,180,180)]">% Tax</span>
                <span className="font-medium text-[rgb(250,250,250)] ml-auto">
                  {formatCurrency(editedData.tax?.amount || 0, editedData.invoice.currency)}
                </span>
              </div>
            ) : (
              editedData.tax && editedData.tax.rate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[rgb(180,180,180)]">
                    Tax ({editedData.tax.rate}%)
                  </span>
                  <span className="font-medium text-[rgb(250,250,250)]">{formatCurrency(editedData.tax.amount, editedData.invoice.currency)}</span>
                </div>
              )
            )}

            <div className="flex justify-between text-lg font-bold pt-3 border-t border-[rgba(255,255,255,0.08)]">
              <span className="text-[rgb(250,250,250)]">Total</span>
              <span className="text-[rgb(250,250,250)]">{formatCurrency(editedData.total, editedData.invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <div>
            <p className="text-xs text-[rgb(180,180,180)]">Issue Date</p>
            <p className="text-sm font-medium text-[rgb(250,250,250)] mt-1">{editedData.invoice.issueDate}</p>
          </div>
          <div>
            <p className="text-xs text-[rgb(180,180,180)]">Due Date</p>
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
                className="mt-1 px-2 py-1.5 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)]"
              />
            ) : (
              <p className="text-sm font-medium text-[rgb(250,250,250)] mt-1">
                {editedData.invoice.dueDate || 'Not set'}
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        {isEditing && (
          <div>
            <label className="text-xs font-semibold text-[rgb(180,180,180)] uppercase tracking-wide mb-2 block">
              Notes (Optional)
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
              className="w-full px-3 py-2 bg-[rgb(8,8,8)] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[rgb(250,250,250)] focus:outline-none focus:ring-1 focus:ring-[rgb(200,245,66)] resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
