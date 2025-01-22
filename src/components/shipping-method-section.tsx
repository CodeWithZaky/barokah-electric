import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BankName, PaymentMethod, ShippingMethod } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";

const shippingCosts = {
  JNE: 15000,
  JNT: 14000,
  SICEPAT: 16000,
  POS_INDONESIA: 18000,
  TIKI: 17000,
};

interface Props {
  form: UseFormReturn<
    {
      shippingMethod: ShippingMethod;
      paymentMethod: PaymentMethod;
      addressId: number;
      notes?: string | undefined;
      bank?: BankName | undefined;
    },
    any,
    undefined
  >;
}

export function ShippingMethodSection({ form }: Props) {
  return (
    <div className="rounded-lg p-4 shadow-sm">
      <div className="mb-4 font-medium">Metode Pengiriman</div>
      <Form {...form}>
        <FormField
          control={form.control}
          name="shippingMethod"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-2"
                >
                  {Object.entries(shippingCosts).map(([method, cost]) => (
                    <div
                      key={method}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={method} id={method} />
                        <Label htmlFor={method}>{method}</Label>
                      </div>
                      <span>Rp{cost.toLocaleString()}</span>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
}
