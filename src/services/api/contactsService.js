import { toast } from "react-toastify";

export const contactsService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch contacts:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      };

      const response = await apperClient.getRecordById('contact_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch contact:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          firstName_c: contactData.firstName,
          lastName_c: contactData.lastName,
          email_c: contactData.email,
          phone_c: contactData.phone,
          title_c: contactData.title,
          notes_c: contactData.notes,
          companyId_c: contactData.companyId ? parseInt(contactData.companyId) : null,
          createdAt_c: new Date().toISOString(),
          updatedAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to create contact:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create contact:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          firstName_c: contactData.firstName,
          lastName_c: contactData.lastName,
          email_c: contactData.email,
          phone_c: contactData.phone,
          title_c: contactData.title,
          notes_c: contactData.notes,
          companyId_c: contactData.companyId ? parseInt(contactData.companyId) : null,
          updatedAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to update contact:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update contact:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to delete contact:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
    }
  },

  async searchContacts(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "companyId_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "firstName_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "lastName_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]}
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to search contacts:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error);
      return [];
    }
  },

  async bulkUpdate(contactIds, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const records = contactIds.map(id => ({
        Id: parseInt(id),
        firstName_c: updateData.firstName,
        lastName_c: updateData.lastName,
        email_c: updateData.email,
        phone_c: updateData.phone,
        title_c: updateData.title,
        notes_c: updateData.notes,
        companyId_c: updateData.companyId ? parseInt(updateData.companyId) : null,
        updatedAt_c: new Date().toISOString()
      }));

      const params = { records };

      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to bulk update contacts:", response.message);
        toast.error(response.message);
        return { updated: [], errors: [], successCount: 0, errorCount: contactIds.length };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return {
          updated: successful.map(r => r.data),
          errors: failed,
          successCount: successful.length,
          errorCount: failed.length
        };
      }
    } catch (error) {
      console.error("Error bulk updating contacts:", error?.response?.data?.message || error);
      return { updated: [], errors: [], successCount: 0, errorCount: contactIds.length };
    }
  },

  async bulkDelete(contactIds) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: contactIds.map(id => parseInt(id))
      };

      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error("Failed to bulk delete contacts:", response.message);
        toast.error(response.message);
        return { deleted: [], errors: [], successCount: 0, errorCount: contactIds.length };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return {
          deleted: successful,
          errors: failed,
          successCount: successful.length,
          errorCount: failed.length
        };
      }
    } catch (error) {
      console.error("Error bulk deleting contacts:", error?.response?.data?.message || error);
      return { deleted: [], errors: [], successCount: 0, errorCount: contactIds.length };
    }
  },

  async bulkExport(contactsData) {
    try {
      // Create CSV content
      const headers = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone', 
        'Title', 'Company', 'Status', 'Created At', 'Updated At'
      ];
      
      const csvRows = [
        headers.join(','),
        ...contactsData.map(contact => [
          contact.Id,
          `"${contact.firstName_c || ''}"`,
          `"${contact.lastName_c || ''}"`,
          `"${contact.email_c || ''}"`,
          `"${contact.phone_c || ''}"`,
          `"${contact.title_c || ''}"`,
          `"${contact.companyId_c?.Name || ''}"`,
          `"Active"`,
          `"${contact.createdAt_c || ''}"`,
          `"${contact.updatedAt_c || ''}"`
        ].join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      
      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return {
        success: true,
        filename: `contacts_export_${new Date().toISOString().split('T')[0]}.csv`,
        count: contactsData.length
      };
    } catch (error) {
      console.error("Error exporting contacts:", error);
      throw error;
    }
  }
};