import { Icons } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";

export const cards = [
  {
    title: "Wallet Balance",
    amount: "0.00",
    currency: "₹",
    iconBgColor: "bg-gradient-to-br from-[#E6CC7A] to-[#C9A33F] border border-white/30 backdrop-blur-sm",      // Blue square
    circleBgColor: "#C9A33F",         // Light amber circle
    className: "bg-[#FAF6EC] border border-[#C9A33F]",
    rightIcon: <Icons.DiagonalArrowIcon className="bg-[#ECF6ED] !shadow-none" />,
    mainIcon: <Icons.WalletBalanceIcon className="w-8 h-8 text-white" />,
    // href: "wallet"
  },

  {
    title: "Document Management",
    iconBgColor: "bg-gradient-to-br from-[#66BB6A] to-[#43A047] border border-white/30 backdrop-blur-sm",
    circleBgColor: "#43A047",
    className: "bg-[#ECF6ED] border border-[#43A047]",
    rightIcon: <Icons.DiagonalArrowIcon className="bg-[#ECF6ED]" />,
    mainIcon: <Icons.FolderDocumentIcon className="w-8 h-8 text-white" />,
    // href: "documents"
  },

  {
    title: "Announement",
    iconBgColor: "bg-gradient-to-br from-[#81D4FA] to-[#4FC3F7] border border-white/30 backdrop-blur-sm",
    circleBgColor: "#4FC3F7",
    className: "bg-[#E5F6FE] border border-[#4FC3F7]",
    subText: "Giving the 20% OFF on all services on New Year occasions",
    rightIcon: <Icons.DiagonalArrowIcon />,
    mainIcon: <Icons.MegaPhoneIcon className="w-8 h-8 text-white" />,
    href: ROUTES.customer.dashboard.sidebar.announcements
  },
];
