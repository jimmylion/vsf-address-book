<template>

  <div class="customer-address-form">
    <div class="row gutter-md">
      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="first-name"
          autocomplete="name"
          :placeholder="`${$t('Full name')} *`"
          v-model.trim="fullName"
          @input="$v.customer.firstName.$touch()"
          :validations="[
            {
              condition: !$v.customer.firstName.required && $v.customer.firstName.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.customer.firstName.minLength,
              text: $t('Name must have at least 3 letters.')
            },
            {
              condition: !$v.customer.lastName.required,
              text: $t('Last name is required')
            }
          ]"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="street-address"
          autocomplete="address-line1"
          :placeholder="`${$t('Street name')} *`"
          v-model.trim="customer.street"
          @input="$v.customer.street.$touch()"
          :validation="{
            condition: !$v.customer.street.required && $v.customer.street.$error,
            text: $t('Field is required')
          }"
        />
      </div>

<!--      <div class="col-xs-12 col-md-6">-->
<!--        <base-input-->
<!--          class="mb-6"-->
<!--          type="text"-->
<!--          name="apartment-number"-->
<!--          autocomplete="address-line2"-->
<!--          :placeholder="`${$t('House/Apartment number')} *`"-->
<!--          v-model.trim="customer.house"-->
<!--          @input="$v.customer.house.$touch()"-->
<!--          :validations="[{-->
<!--            condition: !$v.customer.house.required && $v.customer.house.$error,-->
<!--            text: $t('Field is required')-->
<!--          }]"-->
<!--        />-->
<!--      </div>-->

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="city"
          autocomplete="address-level2"
          :placeholder="`${$t('City')} *`"
          v-model.trim="customer.city"
          @input="$v.customer.city.$touch()"
          :validation="{
            condition: !$v.customer.city.required && $v.customer.city.$error,
            text: $t('Field is required')
          }"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-select
          class="mb-6"
          name="countries"
          :options="countryOptions"
          :selected="customer.country"
          :placeholder="$t('Country *')"
          :validations="[
            {
              condition: $v.customer.country.$error && !$v.customer.country.required,
              text: $t('Field is required')
            }
          ]"
          v-model="customer.country"
          autocomplete="country-name"
          @blur="$v.customer.country.$touch()"
          @change.native="$v.customer.country.$touch(); customer.region = ''; customer.region_id = null"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-select
          v-if="regionOptionsNormalized"
          name="regions"
          :options="regionOptionsNormalized"
          :selected="customer.region_id"
          :placeholder="$t('Region') + ' *'"
          :validations="[
            {
              condition: regionOptionsNormalized && $v.customer.region_id.$error && !$v.customer.region_id.required,
              text: $t('Field is required')
            }
          ]"
          v-model="customer.region_id"
          autocomplete="region-name"
          @blur="$v.customer.region_id.$touch()"
          @change.native="$v.customer.region_id.$touch();"
          class="my-shipping-details__input"
        />
        <base-input
          v-else
          class="mb-6"
          type="text"
          name="state"
          autocomplete="state"
          :placeholder="$t('State')"
          v-model.trim="customer.postcode"
          @input="$v.customer.postcode.$touch()"
          :validations="[
            {
              condition: !$v.customer.postcode.required && $v.customer.postcode.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.customer.postcode.minLength,
              text: $t('Zip-code must have at least 3 letters.')
            }
          ]"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="zip-code"
          autocomplete="postal-code"
          :placeholder="`${$t('Zip-code')} *`"
          v-model.trim="customer.postcode"
          @input="$v.customer.postcode.$touch()"
          :validations="[
            {
              condition: !$v.customer.postcode.required && $v.customer.postcode.$error,
              text: $t('Field is required')
            },
            {
              condition: !$v.customer.postcode.minLength,
              text: $t('Zip-code must have at least 3 letters.')
            }
          ]"
        />
      </div>

      <div class="col-xs-12 col-md-6">
        <base-input
          class="mb-6"
          type="text"
          name="phone-number"
          autocomplete="tel"
          :placeholder="$t('Phone Number')"
          v-model.trim="customer.phone"
        />
      </div>

      <div class="col-xs-12 col-md-6" />

      <div class="col-xs-12 col-md-12">
        <base-checkbox
          class="mb-6"
          id="default_shipping"
          v-model="customer.default_shipping"
          @click="customer.default_shipping = !customer.default_shipping"
        >
          {{ $t('Use as my default shipping address') }}
        </base-checkbox>
      </div>

      <div class="col-xs-12 col-md-12">
        <base-checkbox
          class="mb-6"
          id="default_billing"
          v-model="customer.default_billing"
          @click="customer.default_billing = !customer.default_billing"
        >
          {{ $t('Use as my default billing address') }}
        </base-checkbox>
      </div>

      <div class="col-xs-12 col-sm-6 col-12 mt15">
        <button-full
          @click.native="addcustomerAddress"
          :disabled="$v.$invalid"
        >
          {{ $t('Save') }}
        </button-full>
      </div>
      <div class="col-xs-12 col-sm-6 flex middle-xs py10 mt15">
        <a href="javascript:void(0)" @click="exitSection" class="inline-block text-grey-dark bg-grey-lighter py-2 px-3">
          {{ $t('Cancel') }}
        </a>
      </div>
    </div>

  </div>

</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators'
import ButtonFull from 'theme/components/base/ButtonFull/ButtonFull'
import BaseCheckbox from 'theme/components/base/BaseCheckbox/BaseCheckbox'
import BaseInput from 'theme/components/base/BaseInput/BaseInput'
import BaseSelect from 'theme/components/base/BaseSelect/BaseSelect'
import { AddAddress } from './AddAddress'
import toString from 'lodash-es/toString'

export default {
  name: 'AddressForm',
  props: {
    addressId: {
      type: Number,
      required: false,
      default: null
    },
    countries: {
      type: Array,
      required: true
    }
  },
  components: {
    ButtonFull,
    BaseCheckbox,
    BaseInput,
    BaseSelect
  },
  computed: {
    countryOptions () {
      return this.countries.map((item) => {
        return {
          value: item.id,
          label: item.full_name_locale
        }
      })
    },
    regionOptions () {
      if (!this.customer.country || this.customer.country === '') {
        return
      }
      const countryObj = this.countries.find(country => country.id === this.customer.country)
      if (!countryObj) {
        return
      }
      return countryObj.available_regions
    },
    regionOptionsNormalized () {
      return this.regionOptions ? this.regionOptions.map((item) => {
        return {
          value: +item.id,
          label: item.name
        }
      }) : null
    },
    fullName: {
      get () {
        if (!this.customer.lastName && (!this.customer.firstName || !this.customer.firstName.endsWith(' '))) {
          return this.customer.firstName
        }
        const fullName = `${this.customer.firstName} ${this.customer.lastName}`
        return fullName.trim().length ? fullName : ''
      },
      set (value) {
        const tmp = value.split(' ')
        this.customer.firstName = tmp.shift()
        this.customer.lastName = tmp.join(' ')
      }
    }
  },
  data () {
    return {
      customer: {
        firstName: null,
        lastName: null,
        phone: null,
        street: null,
        house: null,
        city: null,
        region: null,
        region_id: null,
        country: null,
        postcode: null,
        default_shipping: false,
        default_billing: false
      }
    }
  },
  mounted () {
    this.customer = this.getCustomerAddress()
    // this.$set(this.customer, 'region_id', null)
  },
  watch: {
    'customer.region_id' (regionId) {
      const regionObject = this.regionOptionsNormalized && this.regionOptionsNormalized.find(region => region.value === +regionId)
      if (regionObject) {
        this.customer.region = regionObject.label
      }
    }
  },
  mixins: [ AddAddress ],
  methods: {
    exitSection () {
      this.$v.$reset()

      this.customer = {
        firstName: '',
        lastName: '',
        street: '',
        house: '',
        city: '',
        postcode: '',
        region: '',
        region_id: null,
        country: '',
        phone: '',
        default_shipping: false,
        default_billing: false
      }

      this.$emit('reset-toggle')
    },
    addcustomerAddress () {
      if (this.addressId === null) {
        this.addAddress(this.customer)
      } else {
        if (!this.objectsEqual(this.customer, this.getCustomerAddress())) {
          this.updateAddress(this.addressId, this.customer)
        }
      }
      this.exitSection()
    },
    getCustomerAddress () {
      let currentUser = Object.assign({}, this.$store.state.user.current)
      if (currentUser && this.addressId !== null) {
        let index
        for (let i = 0; i < currentUser.addresses.length; i++) {
          if (toString(currentUser.addresses[i].id) === toString(this.addressId)) {
            index = i
          }
        }
        if (index >= 0) {
          const regionName = typeof currentUser.addresses[index].region === 'string' ? currentUser.addresses[index].region : currentUser.addresses[index].region.region
          let regionId
          if (this.regionOptionsNormalized && regionName) {
            const region = this.regionOptionsNormalized.find(region => region.label === regionName)
            if (region) {
              regionId = region.value
            }
          }

          return {
            firstName: currentUser.addresses[index].firstname,
            lastName: currentUser.addresses[index].lastname,
            street: currentUser.addresses[index].street[0],
            house: '1',
            city: currentUser.addresses[index].city,
            postcode: currentUser.addresses[index].postcode,
            region: currentUser.addresses[index].region.region ? currentUser.addresses[index].region.region : '',
            region_id: regionId ? regionId : (currentUser.addresses[index].region_id ? currentUser.addresses[index].region_id : 0),
            country: currentUser.addresses[index].country_id,
            phone: currentUser.addresses[index].hasOwnProperty('telephone') ? currentUser.addresses[index].telephone : '',
            default_shipping: currentUser.addresses[index].default_shipping ? currentUser.addresses[index].default_shipping : false,
            default_billing: currentUser.addresses[index].default_billing ? currentUser.addresses[index].default_billing : false
          }
        }
      } else {
        return {
          firstName: '',
          lastName: '',
          street: '',
          house: '',
          city: '',
          postcode: '',
          region: '',
          region_id: null,
          country: '',
          phone: '',
          default_shipping: false,
          default_billing: false
        }
      }
    },
    objectsEqual (a, b) {
      const aProps = Object.keys(a)
      const bProps = Object.keys(b)

      if (aProps.length !== bProps.length) {
        return false
      }

      for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i]
        if (!b.hasOwnProperty(propName)) {
          return false
        } else {
          if (a[propName] !== null && b[propName] !== null && a[propName] === 'object' && b[propName] === 'object') {
            if (!this.objectsEqual(a[propName], b[propName])) {
              return false
            }
          } else if (a[propName] !== b[propName]) {
            return false
          }
        }
      }
      return true
    }
  },
  validations() {
    const base = {
      customer: {
        firstName: {
          required,
          minLength: minLength(3)
        },
        lastName: {
          required
        },
        country: {
          required
        },
        street: {
          required
        },
        // house: {
        //   required
        // },
        postcode: {
          required,
          minLength: minLength(3)
        },
        city: {
          required
        }
      }
    }

    if (this.regionOptionsNormalized) {
      base.customer.region_id = {
        required
      }
    }
    return base
  }
}
</script>
<style lang="scss">
.customer-address-form {
  .checkbox-wrap {
    position: relative;
  }
}
</style>
