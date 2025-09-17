import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { contactsService } from "@/services/api/contactsService";
import { companiesService } from "@/services/api/companiesService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ContactModal from "./ContactModal";
import { format } from "date-fns";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [contactsData, companiesData] = await Promise.all([
        contactsService.getAll(),
        companiesService.getAll()
      ]);
      setContacts(contactsData);
      setCompanies(companiesData);
      setFilteredContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactsService.delete(contactId);
      setContacts(contacts.filter(c => c.Id !== contactId));
      toast.success("Contact deleted successfully");
    } catch (err) {
      toast.error("Failed to delete contact");
      console.error("Error deleting contact:", err);
    }
  };

  const handleContactSaved = (savedContact) => {
    if (selectedContact) {
      // Update existing contact
      setContacts(contacts.map(c => 
        c.Id === savedContact.Id ? savedContact : c
      ));
      toast.success("Contact updated successfully");
    } else {
      // Add new contact
      setContacts([savedContact, ...contacts]);
      toast.success("Contact created successfully");
    }
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId);
    return company ? company.name : "Unknown Company";
  };

  if (loading) return <Loading variant="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
          <p className="text-slate-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        <Button onClick={handleAddContact} className="btn-gradient">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      {/* Contact List */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          description={searchTerm ? 
            "No contacts match your search criteria. Try adjusting your search." :
            "Get started by adding your first contact to begin managing relationships."
          }
          icon="Users"
          actionLabel="Add First Contact"
          onAction={searchTerm ? undefined : handleAddContact}
          showAction={!searchTerm}
        />
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm font-medium text-primary-600 mb-1">
                          {contact.title}
                        </p>
                        <p className="text-sm text-slate-600 mb-1">
                          {getCompanyName(contact.companyId)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <ApperIcon name="Mail" className="h-4 w-4 mr-1" />
                            {contact.email}
                          </div>
                          <div className="flex items-center">
                            <ApperIcon name="Phone" className="h-4 w-4 mr-1" />
                            {contact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditContact(contact)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact.Id)}
                        className="text-error-600 hover:text-error-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {contact.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600">{contact.notes}</p>
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Created: {format(new Date(contact.createdAt), "MMM d, yyyy")}</span>
                    <span>Updated: {format(new Date(contact.updatedAt), "MMM d, yyyy")}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        companies={companies}
        onContactSaved={handleContactSaved}
      />
    </div>
  );
};

export default ContactList;