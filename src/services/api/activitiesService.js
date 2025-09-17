import { toast } from "react-toastify";

const activityTypes = ["Call", "Email", "Meeting", "Task", "Note"];

export const activitiesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      };

      const response = await apperClient.getRecordById('activity_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch activity:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching activity:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          type_c: activityData.type,
          subject_c: activityData.subject,
          description_c: activityData.description,
          contactId_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          dealId_c: activityData.dealId ? parseInt(activityData.dealId) : null,
          dueDate_c: activityData.dueDate,
          completed_c: activityData.completed || false,
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to create activity:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create activity:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          type_c: activityData.type,
          subject_c: activityData.subject,
          description_c: activityData.description,
          contactId_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          dealId_c: activityData.dealId ? parseInt(activityData.dealId) : null,
          dueDate_c: activityData.dueDate,
          completed_c: activityData.completed || false
        }]
      };

      const response = await apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to update activity:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update activity:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to delete activity:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByContactId(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [{"FieldName": "contactId_c", "Operator": "EqualTo", "Values": [parseInt(contactId)]}]
      };

      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by contact:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByDealId(dealId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [{"FieldName": "dealId_c", "Operator": "EqualTo", "Values": [parseInt(dealId)]}]
      };

      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by deal:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  },

  async markCompleted(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: true
        }]
      };

      const response = await apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to mark activity completed:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to mark activity completed:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error marking activity completed:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getUpcoming(limit = 10) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const now = new Date().toISOString();

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [
          {"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]},
          {"FieldName": "dueDate_c", "Operator": "GreaterThanOrEqualTo", "Values": [now]}
        ],
        orderBy: [{"fieldName": "dueDate_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };

      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch upcoming activities:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getOverdue() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const now = new Date().toISOString();

      const params = {
        fields: [
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "contactId_c"}},
          {"field": {"Name": "dealId_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        where: [
          {"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]},
          {"FieldName": "dueDate_c", "Operator": "LessThan", "Values": [now]}
        ]
      };

      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch overdue activities:", response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching overdue activities:", error?.response?.data?.message || error);
      return [];
    }
  },

  getActivityTypes() {
    return [...activityTypes];
  }
};