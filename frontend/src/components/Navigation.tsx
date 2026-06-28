import { Button } from "@/components/ui/button";
import {
  Factory, Hammer, Globe, Lightbulb, Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Materials",
      icon: Package,
      path: "/materials",
      description: "Raw materials overview"
    },
    {
      label: "Manufacturing",
      icon: Factory,
      path: "/manufacturing",
      description: "Production jobs"
    },
    {
      label: "Refining",
      icon: Hammer,
      path: "/refining",
      description: "Ore processing"
    },
    {
      label: "Planetary Industry",
      icon: Globe,
      path: "/planetary-industry",
      description: "Colony management"
    },
    {
      label: "Invention",
      icon: Lightbulb,
      path: "/invention",
      description: "T2 research"
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.path}
            variant="outline"
            size="sm"
            onClick={() => navigate(item.path)}
            className="flex items-center gap-2"
            title={item.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}