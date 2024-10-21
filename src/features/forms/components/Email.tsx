import React, { useId } from "react";
import { useTsController } from "@ts-react/form";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useFormId } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

const EmailComponent = () => {
  const { field, error } = useTsController<{
    emailAddress: string;
    type: string;
  }>();

  const id = useFormId("email");

  return (
    <div className="mb-4">
      <Label htmlFor={id}>Email Address</Label>
      <Input
        id={id}
        type="email"
        placeholder="Email"
        onChange={(e) =>
          field.onChange({ ...field.value, emailAddress: e.target.value })
        }
      />
      <Select
        defaultValue="business"
        onValueChange={(value) =>
          field.onChange({ ...field.value, type: value })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="business">Geschäftlich</SelectItem>
          <SelectItem value="personal">Privat</SelectItem>
          <SelectItem value="office">Büro</SelectItem>
          <SelectItem value="other">Alternativ</SelectItem>
        </SelectContent>
      </Select>
      {error?.errorMessage && (
        <span className="text-red-500">{error?.errorMessage}</span>
      )}
    </div>
  );
};

export default EmailComponent;
