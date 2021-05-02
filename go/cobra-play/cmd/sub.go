/*
Copyright © 2021 NAME HERE <EMAIL ADDRESS>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package cmd

import (
	"fmt"
	"strconv"

	"github.com/spf13/cobra"
)

func parseFloat(input string) (float64, error) {
	a, err := strconv.ParseFloat(input, 64)
	if err != nil {
		return 0, err
	}
	return a, nil
}

func parseInt(input string) (int64, error) {
	a, err := strconv.ParseInt(input, 10, 64)
	if err != nil {
		return 0, err
	}
	return a, nil
}

// addCmd represents the add command
var subCmd = &cobra.Command{
	Use:   "sub [a] [b]",
	Short: "Subtract 2 numbers",
	Long:  ``,
	Args:  cobra.ExactArgs(2),
	Run: func(cmd *cobra.Command, args []string) {
		fstatus, _ := cmd.Flags().GetBool("float")

		if fstatus {
			a, err := parseFloat(args[0])
			if err != nil {
				fmt.Println("First param is not number", err)
				return
			}

			b, err := parseFloat(args[1])
			if err != nil {
				fmt.Println("Second param is not number", err)
				return
			}
			fmt.Println(a - b)
		} else {
			a, err := parseInt(args[0])
			if err != nil {
				fmt.Println("First param is not number", err)
				return
			}

			b, err := parseInt(args[1])
			if err != nil {
				fmt.Println("Second param is not number", err)
				return
			}
			fmt.Println(a - b)
		}

	},
}

func init() {
	rootCmd.AddCommand(subCmd)

	subCmd.Flags().BoolP("float", "f", false, "Floating Numbers")
}
