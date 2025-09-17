import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Header = ({ onMenuToggle, title }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  return (
    <header className="bg-white border-b border-slate-200 shadow-soft lg:ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-slate-100"
              onClick={onMenuToggle}
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </Button>
            
            {title && (
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-slate-900">
                {title}
              </h1>
            )}
          </div>

{/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-100 relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-error-500 to-error-600 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-100"
            >
              <ApperIcon name="Settings" className="h-5 w-5 text-slate-600" />
            </Button>

            {user && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-slate-200">
                <div className="text-sm text-slate-600">
                  {user.firstName} {user.lastName}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="p-2 hover:bg-slate-100"
                  title="Logout"
                >
                  <ApperIcon name="LogOut" className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;