import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PaymentMethod = {
  COD: "COD",
  BANK_TRANSFER: "BANK_TRANSFER",
};

const BankType = {
  BRI: "BRI",
  BNI: "BNI",
  MANDIRI: "MANDIRI",
};

export function PaymentMethodSection({ form }: any) {
  return (
    <div className="rounded-lg p-4 shadow-sm">
      <div className="mb-4 font-medium">Metode Pembayaran</div>
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === PaymentMethod.COD) {
                        form.setValue("bank", undefined);
                      }
                    }}
                    defaultValue={field.value}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value={PaymentMethod.COD} id="cod" />
                      <Label htmlFor="cod">Bayar di Tempat (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem
                        value={PaymentMethod.BANK_TRANSFER}
                        id="bank"
                      />
                      <Label htmlFor="bank">Transfer Bank</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("paymentMethod") === PaymentMethod.BANK_TRANSFER && (
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem className="ml-6">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      {Object.values(BankType).map((bank) => (
                        <div
                          key={bank}
                          className="flex items-center space-x-2 rounded-lg border p-4"
                        >
                          <RadioGroupItem
                            value={bank}
                            id={bank.toLowerCase()}
                          />
                          <Label htmlFor={bank.toLowerCase()}>
                            Bank {bank}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </Form>
    </div>
  );
}
