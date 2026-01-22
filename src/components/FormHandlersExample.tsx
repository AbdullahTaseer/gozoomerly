'use client';

import { useFormHandlers } from '@/hooks/use-form-handlers';

export default function FormHandlersExample() {
  const { formHandlers, isLoading, error, refetch } = useFormHandlers(4);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading form handlers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => refetch(4)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Form Handlers for Partner ID: 4
        </h2>
        <button
          onClick={() => refetch(4)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {formHandlers.length === 0 ? (
        <div className="text-gray-500">
          No form handlers found for partner ID 4
        </div>
      ) : (
        <div className="space-y-4">
          {formHandlers.map((handler) => (
            <div
              key={handler.id}
              className="border rounded-lg p-6 bg-white shadow-sm"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-semibold">ID:</span> {handler.id}
                </div>
                <div>
                  <span className="font-semibold">Partner ID:</span>{' '}
                  {handler.partner_id}
                </div>
                <div>
                  <span className="font-semibold">Service ID:</span>{' '}
                  {handler.service_id}
                </div>
                <div>
                  <span className="font-semibold">Brand ID:</span>{' '}
                  {handler.brand_id}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">Service URL:</span>{' '}
                  <a
                    href={handler.service_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {handler.service_url}
                  </a>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Form Fields:</h3>
                <div className="space-y-2">
                  {handler.form_data.map((field) => (
                    <div
                      key={field.id}
                      className="p-3 bg-gray-50 rounded border"
                    >
                      <div className="font-medium">{field.label}</div>
                      <div className="text-sm text-gray-600">
                        Type: {field.type}
                        {field.required && (
                          <span className="text-red-500 ml-2">*Required</span>
                        )}
                      </div>
                      {field.placeholder && (
                        <div className="text-sm text-gray-500">
                          Placeholder: {field.placeholder}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <div>Created: {new Date(handler.created_at).toLocaleString()}</div>
                <div>Updated: {new Date(handler.updated_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
