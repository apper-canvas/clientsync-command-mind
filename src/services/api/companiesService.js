import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const companiesService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('company_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch companies:", response.message);
        toast.error(response.message);
        return [];
}

      // Transform database field names to UI field names
      const transformedData = (response.data || []).map(item => ({
        Id: item.Id,
        name: item.name_c,
        industry: item.industry_c,
        size: item.size_c,
        website: item.website_c,
        address: item.address_c,
        notes: item.notes_c,
        createdAt: item.createdAt_c
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ]
      };

      const response = await apperClient.getRecordById('company_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch company:", response.message);
        throw new Error(response.message);
}

      // Transform database field names to UI field names
      const transformedData = {
        Id: response.data.Id,
        name: response.data.name_c,
        industry: response.data.industry_c,
        size: response.data.size_c,
        website: response.data.website_c,
        address: response.data.address_c,
        notes: response.data.notes_c,
        createdAt: response.data.createdAt_c
      };

      return transformedData;
    } catch (error) {
      console.error("Error fetching company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: companyData.name,
          industry_c: companyData.industry,
          size_c: companyData.size,
          website_c: companyData.website,
          address_c: companyData.address,
          notes_c: companyData.notes,
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('company_c', params);
      
      if (!response.success) {
        console.error("Failed to create company:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create company:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
}
        
        if (successful.length > 0) {
          // Transform database field names to UI field names
          const rawData = successful[0].data;
          const transformedData = {
            Id: rawData.Id,
            name: rawData.name_c,
            industry: rawData.industry_c,
            size: rawData.size_c,
            website: rawData.website_c,
            address: rawData.address_c,
            notes: rawData.notes_c,
            createdAt: rawData.createdAt_c
          };
          return transformedData;
        }
        return null;
      }
    } catch (error) {
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: companyData.name,
          industry_c: companyData.industry,
          size_c: companyData.size,
          website_c: companyData.website,
          address_c: companyData.address,
          notes_c: companyData.notes
        }]
      };

      const response = await apperClient.updateRecord('company_c', params);
      
      if (!response.success) {
        console.error("Failed to update company:", response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update company:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
}
        
        if (successful.length > 0) {
          // Transform database field names to UI field names
          const rawData = successful[0].data;
          const transformedData = {
            Id: rawData.Id,
            name: rawData.name_c,
            industry: rawData.industry_c,
            size: rawData.size_c,
            website: rawData.website_c,
            address: rawData.address_c,
            notes: rawData.notes_c,
            createdAt: rawData.createdAt_c
          };
          return transformedData;
        }
        return null;
      }
    } catch (error) {
      console.error("Error updating company:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('company_c', params);
      
      if (!response.success) {
        console.error("Failed to delete company:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete company:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting company:", error?.response?.data?.message || error);
      return false;
    }
  },

  async searchCompanies(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "createdAt_c"}}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {"fieldName": "name_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "industry_c", "operator": "Contains", "values": [query]}
              ]
            },
            {
              conditions: [
                {"fieldName": "size_c", "operator": "Contains", "values": [query]}
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords('company_c', params);
      
      if (!response.success) {
        console.error("Failed to search companies:", response.message);
        return [];
}

      // Transform database field names to UI field names
      const transformedData = (response.data || []).map(item => ({
        Id: item.Id,
        name: item.name_c,
        industry: item.industry_c,
        size: item.size_c,
        website: item.website_c,
        address: item.address_c,
        notes: item.notes_c,
        createdAt: item.createdAt_c
      }));

      return transformedData;
    } catch (error) {
      console.error("Error searching companies:", error?.response?.data?.message || error);
return [];
    }
  }
};