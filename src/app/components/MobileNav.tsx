import React from "react";
import {
  Drawer,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { XMarkIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import { PowerIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import { MenuItems } from "@/app/types/index";
import SignOutButtn from "./SignOutButtn";

interface Props {
  open: boolean;
  onClose(): void;
  menuItems: MenuItems[];
}

export function MobileNav({ open, onClose, menuItems }: Props) {
  const { isAdmin, loggedIn } = useAuth();

  return (
    <>
      <Drawer open={open} onClose={onClose} placeholder="">
        <div className="mb-2 flex items-center justify-between p-4 z-50">
          <Typography variant="h5" color="blue-gray" placeholder="">
            E-SHOP
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={onClose}
            placeholder={undefined}
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>
        <List placeholder={undefined}>
          {menuItems.map(({ href, icon, label }) => {
            return (
              <Link key={href} href={href}>
                <ListItem onClick={onClose} placeholder="">
                  <ListItemPrefix placeholder={undefined}>
                    {icon}
                  </ListItemPrefix>
                  {label}
                </ListItem>
              </Link>
            );
          })}

          {isAdmin ? (
            <Link href="/dashboard">
              <ListItem onClick={onClose} placeholder="">
                <ListItemPrefix placeholder={undefined}>
                  <RectangleGroupIcon className="h-4 w-4" />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </Link>
          ) : null}

          {loggedIn ? (
            <SignOutButtn>
              <ListItem placeholder="">
                <ListItemPrefix placeholder={undefined}>
                  <PowerIcon className="h-5 w-5" />
                </ListItemPrefix>
                Sign Out
              </ListItem>
            </SignOutButtn>
          ) : (
            <div className="flex items-center">
              <Link
                className="px-4 py-1 flex-1 text-center"
                href="/auth/signin"
              >
                Sign in
              </Link>

              <Link
                className="bg-blue-500 text-white px-4 py-1 rounded flex-1 text-center"
                href="/auth/signup"
              >
                Sign up
              </Link>
            </div>
          )}
        </List>
      </Drawer>
    </>
  );
}
