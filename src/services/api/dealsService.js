import { toast } from "react-toastify";

const dealStages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export const dealsService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('deal_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch deals:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      };

      const response = await apperClient.getRecordById('deal_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch deal:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          title_c: dealData.title,
          value_c: parseFloat(dealData.value),
          stage_c: dealData.stage,
          probability_c: parseInt(dealData.probability),
          closeDate_c: dealData.closeDate,
          notes_c: dealData.notes,
          contactId_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          companyId_c: dealData.companyId ? parseInt(dealData.companyId) : null,
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('deal_c', params);
      
      if (!response.success) {
        console.error("Failed to create deal:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create deal:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title,
          value_c: parseFloat(dealData.value),
          stage_c: dealData.stage,
          probability_c: parseInt(dealData.probability),
          closeDate_c: dealData.closeDate,
          notes_c: dealData.notes,
          contactId_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          companyId_c: dealData.companyId ? parseInt(dealData.companyId) : null
        }]
      };

      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error("Failed to update deal:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update deal:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('deal_c', params);
      
      if (!response.success) {
        console.error("Failed to delete deal:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async updateStage(id, newStage) {
    try {
      if (!dealStages.includes(newStage)) {
        throw new Error("Invalid deal stage");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          stage_c: newStage,
          probability_c: newStage === "Closed Won" ? 100 : newStage === "Closed Lost" ? 0 : undefined
        }]
      };

      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error("Failed to update deal stage:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update deal stage:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating deal stage:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getDealsByStage() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "closeDate_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "companyId_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('deal_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch deals by stage:", response.message);
        return {};
      }

      const deals = response.data || [];
      const dealsByStage = {};
      
      dealStages.forEach(stage => {
        dealsByStage[stage] = deals.filter(deal => deal.stage_c === stage);
      });
      
      return dealsByStage;
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return {};
    }
  },

  getDealStages() {
    return [...dealStages];
  }
};