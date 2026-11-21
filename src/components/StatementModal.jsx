import React, { useRef } from 'react';
import { useBank } from '../context/BankContext';
import { X, Printer } from 'lucide-react';

export const StatementModal = () => {
  const { user, transactions, activeModal, setActiveModal, triggerFeedback } = useBank();
  const printRef = useRef(null);

  if (activeModal !== 'statement') return null;

  const close = () => {
    triggerFeedback();
    setActiveModal(null);
  };

  const handlePrint = () => {
    triggerFeedback('beep');
    window.print();
  };

  // Statement rows displayed in chronological order (1 to 15)
  const statementRows = [...transactions].reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        {/* Modal Top Action Bar (hidden when printing) */}
        <div className="bg-[#0B2545] text-white px-4 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-[#ED1B24] text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide">
              KOTAK
            </span>
            <span className="text-xs font-bold">Account e-Statement</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={close}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Printable Statement Sheet */}
        <div ref={printRef} className="overflow-y-auto flex-1 font-sans text-black bg-white">
          {/* Top Red Banner with Kotak Logo */}
          <div className="bg-[#FF0000] py-3.5 px-6 flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-[#003366] flex items-center justify-center border-2 border-white/20 shadow-sm">
                <span className="text-white font-black text-lg tracking-tighter">∞</span>
              </div>
              <div className="text-white leading-none">
                <div className="text-2xl font-black tracking-tight flex items-start">
                  <span>kotak</span>
                  <span className="text-[10px] font-bold ml-0.5">®</span>
                </div>
                <div className="text-xs font-normal tracking-wide">Kotak Mahindra Bank</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-center text-lg md:text-xl font-medium text-black mb-5">
              Account Statement
            </h1>

            {/* Top Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 text-xs text-black">
              {/* Left: Customer Name & Address */}
              <div className="space-y-1.5 leading-snug">
                <p className="font-normal uppercase">{user.name}</p>
                {(user.addressLines || [
                  "107,",
                  "JAWAHAR NAGAR",
                  "R K NAGAR,",
                  "Kanpur,",
                  "UTTAR PRADESH",
                  "INDIA",
                  "208012"
                ]).map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>

              {/* Right: Account Metadata */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
                <span>Cust. Reln. No.</span>
                <span>{user.crn}</span>

                <span>Account No.</span>
                <span>{user.accountNo}</span>

                <span>Period</span>
                <span>{user.statementPeriod || "From 14/10/2026 To 26/10/2026"}</span>

                <span>Currency</span>
                <span>{user.currency || "INR"}</span>

                <span>Branch</span>
                <span>{user.branchName || "NEW DELHI - NEHRU PLACE"}</span>

                <span>Nomination Regd</span>
                <span>{user.nomineeRegistered || "Y"}</span>

                <span>Nominee Name</span>
                <span>{user.nomineeName || ""}</span>

                <span>Joint Holder(S)</span>
                <span>{user.jointHolder || ""}</span>
              </div>
            </div>

            {/* Statement Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px] text-black">
                <thead>
                  <tr className="bg-[#555555] text-white font-semibold border border-[#555555]">
                    <th className="py-1.5 px-2 whitespace-nowrap border-r border-white/20">Sl. No.</th>
                    <th className="py-1.5 px-3 whitespace-nowrap border-r border-white/20">Date</th>
                    <th className="py-1.5 px-3 border-r border-white/20">Description</th>
                    <th className="py-1.5 px-3 whitespace-nowrap border-r border-white/20">Chq / Ref number</th>
                    <th className="py-1.5 px-3 whitespace-nowrap border-r border-white/20 text-right">Amount</th>
                    <th className="py-1.5 px-2 whitespace-nowrap border-r border-white/20 text-center">Dr / Cr</th>
                    <th className="py-1.5 px-3 whitespace-nowrap border-r border-white/20 text-right">Balance</th>
                    <th className="py-1.5 px-2 whitespace-nowrap text-center">Dr / Cr</th>
                  </tr>
                </thead>
                <tbody>
                  {statementRows.map((txn, index) => {
                    const isDebit = txn.type === 'debit';
                    return (
                      <tr key={txn.id || index} className="align-top border-b border-slate-100 last:border-b-0">
                        <td className="py-1.5 px-2">{txn.statementNo || index + 1}</td>
                        <td className="py-1.5 px-3 whitespace-nowrap">
                          {txn.statementDate || txn.date}
                        </td>
                        <td className="py-1.5 px-3 max-w-[260px] leading-tight">
                          {txn.narration || txn.title}
                        </td>
                        <td className="py-1.5 px-3 whitespace-nowrap">
                          {txn.refId || ""}
                        </td>
                        <td className="py-1.5 px-3 whitespace-nowrap text-right font-medium">
                          {txn.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td className="py-1.5 px-2 whitespace-nowrap text-center">
                          {isDebit ? 'DR' : 'CR'}
                        </td>
                        <td className="py-1.5 px-3 whitespace-nowrap text-right font-medium">
                          {txn.balance !== undefined && txn.balance !== null
                            ? txn.balance.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })
                            : '-'}
                        </td>
                        <td className="py-1.5 px-2 whitespace-nowrap text-center">
                          CR
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
