'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import GlobalInput from '@/components/inputs/GlobalInput';
import MoreFilters from '@/components/adminComponents/MoreFilters';
import { Switch } from '@/components/ui/switch';
import type { FaqItem } from '@/lib/faqsStore';
import { adminUpsertFaq, adminDeleteFaq, listFaqs } from '@/lib/supabase/faqs';

const preview = (text: string, max = 80) => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
};

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const refreshList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    const { data, error } = await listFaqs({ includeInactive: true });
    setListLoading(false);
    if (error) {
      setListError(error.message);
      setFaqs([]);
      return;
    }
    setFaqs(data ?? []);
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return faqs.filter((f) => {
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
      );
    });
  }, [faqs, searchQuery]);

  const openCreate = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setDisplayOrder('');
    setIsActive(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setDisplayOrder(String(item.sortOrder));
    setIsActive(item.isActive);
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormError('');
    setSaving(false);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    const a = answer.trim();
    const order = Number(displayOrder);
    if (!q || !a) {
      setFormError('Question and answer are required.');
      return;
    }
    if (!displayOrder.trim() || isNaN(order) || order < 1) {
      setFormError('Display order must be a number greater than 0.');
      return;
    }
    setFormError('');
    setSaving(true);

    const { error } = await adminUpsertFaq({
      p_id: editingId,
      p_question: q,
      p_answer: a,
      p_display_order: order,
      p_is_active: isActive,
    });

    setSaving(false);
    if (error) {
      setFormError(error.message);
      return;
    }

    await refreshList();
    closeModal();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');

    const { error } = await adminDeleteFaq(deleteTarget.id);

    setDeleting(false);
    if (error) {
      setDeleteError(error.message);
      return;
    }

    setDeleteTarget(null);
    await refreshList();
  };

  const getStatusStyle = (active: boolean) =>
    active
      ? { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' }
      : { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Inactive' };

  return (
    <div>
      {listError ? (
        <div
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          Could not load FAQs: {listError}
        </div>
      ) : null}

      <div className="max-[500px]:grid grid-cols-1 flex flex-wrap justify-end items-center gap-4 my-6">
        <button
          type="button"
          onClick={openCreate}
          disabled={listLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition-colors order-first max-[500px]:order-none w-full sm:w-auto disabled:opacity-50"
        >
          <Plus size={18} />
          Add FAQ
        </button>
        <MoreFilters
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        <div className="max-[500px]:w-full w-[180px] bg-white relative">
          <GlobalInput
            id="faq-search"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            width="100%"
            height="40px"
            className="relative"
            inputClassName="pr-10"
          />
          <div className="absolute right-3 top-[11px] pointer-events-none">
            <Search size={18} className="text-gray-900" />
          </div>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-190px)] max-h-[100vh]">
        <div className="relative rounded-[10px] w-full border border-[#DBDADE] bg-white overflow-hidden">
          <div className="h-[calc(100vh-170px)] md:h-[calc(100vh-190px)] max-h-[100vh] w-full overflow-x-auto overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-black text-white border-b border-[#E9E9E9] text-lg sticky top-[0px] z-30">
                <tr>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium text-left">
                    Order
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium text-left">
                    Status
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium text-left">
                    Question
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-left min-w-[220px]">
                    Answer
                  </th>
                  <th scope="col" className="px-6 whitespace-nowrap py-4 font-medium text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {listLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                      Loading…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
                      {listError
                        ? 'Fix the error above, then refresh the page.'
                        : 'No FAQs yet. Add one or adjust your search.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => {
                    const status = getStatusStyle(item.isActive);
                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-[#E9E9E9] hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap align-top">
                          {item.sortOrder}
                        </td>
                        <td className="px-6 py-4 align-top">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium align-top max-w-[280px]">
                          {item.question}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 align-top">
                          {preview(item.answer)}
                        </td>
                        <td className="px-6 py-4 align-top text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-800 border border-[#DBDADE] bg-white hover:bg-gray-100 transition-colors"
                            >
                              <Pencil size={16} className="text-gray-600" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => { setDeleteError(''); setDeleteTarget(item); }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-red-700 border border-red-200 bg-white hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={16} className="text-red-500" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
          role="presentation"
          onClick={() => { if (!deleting) setDeleteTarget(null); }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-modal-title" className="text-lg font-bold text-gray-900 mb-2">
              Delete FAQ
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              Are you sure you want to delete this FAQ?
            </p>
            <p className="text-sm text-gray-800 font-medium mb-4 line-clamp-2">
              &ldquo;{deleteTarget.question}&rdquo;
            </p>
            {deleteError ? (
              <p className="text-sm text-red-600 mb-3" role="alert">
                {deleteError}
              </p>
            ) : null}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-[#DBDADE] hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {modalOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
          role="presentation"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-modal-title"
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[min(90vh,640px)] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="faq-modal-title" className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit FAQ' : 'New FAQ'}
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border border-[#DBDADE] px-3 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Active</p>
                  <p className="text-xs text-gray-500">Inactive FAQs are hidden on the public FAQ section.</p>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <div>
                <label htmlFor="faq-display-order" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  id="faq-display-order"
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  placeholder="e.g. 1, 2, 3…"
                  className="w-full rounded-md border border-[#DBDADE] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500"
                />
              </div>
              <div>
                <label htmlFor="faq-question" className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <textarea
                  id="faq-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-[#DBDADE] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 resize-y min-h-[80px]"
                />
              </div>
              <div>
                <label htmlFor="faq-answer" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <textarea
                  id="faq-answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={5}
                  className="w-full rounded-md border border-[#DBDADE] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-500 resize-y min-h-[120px]"
                />
              </div>
              {formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border border-[#DBDADE] hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
                >
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminFaqs;
